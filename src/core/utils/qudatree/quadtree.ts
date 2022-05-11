import { Bound } from "../../type";
import IntList from "./intlist";

/* --------------------------- ELEMENT NODE FIELD --------------------------- */

const enode_num = 2; 

// Points to the next element in leaf node. -1 indicates the end of the list. 
const enode_idx_next = 0; 

// Stores the element index
const enode_idx_elt = 1; 

/* ------------------------------ ELEMENT FIELD ----------------------------- */

const elt_num = 5; 

// Stores the element's AABB
const elt_idx_lft = 0;
const elt_idx_top = 1;
const elt_idx_rgt = 2;
const elt_idx_btm = 3;

// Stores the elemnt's id 
const elt_idx_id = 4; 

/* ----------------------------- QUADNODE FIELD ---------------------------- */

const qnode_num = 2; 

// Points to the first child 
const qnode_idx_fc = 0; 

// Stores the number of children 
const qnode_idx_num_children = 1; 

/* --------------------------- QUADNODE DATA FIELD -------------------------- */

const qnd_num = 6; 

// AABB stored in (center, halfsize) format
const qnd_idx_mx = 0;
const qnd_idx_my = 1;
const qnd_idx_sx = 2;
const qnd_idx_sy = 3;

// Stores the node index
const qnd_idx_index = 4;

// Stores the node depth
const qnd_idx_depth = 5; 

/* -------------------------------------------------------------------------- */
/**
 * This quadtree uses a triple referece structure. qnodes -> enodes -> elts
 * And elts stores an id that points to an external shape map that can be used for fine grained collision detection. 
 * SEE https://stackoverflow.com/questions/41946007/efficient-and-well-explained-implementation-of-a-quadtree-for-2d-collision-det#comment107230829_48355534
 */

export class Quadtree {

    private qnodes = new IntList(qnode_num); 
    private enodes = new IntList(enode_num); 
    private elts = new IntList(elt_num); 
    /* ------------------------------ QUADTREE DATA ----------------------------- */
    // Root's AABB
    private root_mx: number; 
    private root_my: number; 
    private root_sx: number; 
    private root_sy: number; 

    // # of elements allowed before a node split
    private max_elements: number; 

    // Depth allowed before the tree stops splitting
    private max_depth: number; 

    // Buffer for queries
    private temp!: boolean[]; 
    

    /**
     * Create a quadtree with the specified dimension, max elements per node, and max depth. 
     * @param w 
     * @param h 
     * @param max_elements 
     * @param max_depth 
     */
    constructor(w: number, h: number, max_elements: number, max_depth: number) {
        this.root_mx = this.root_sx = w / 2; 
        this.root_my = this.root_sy = h / 2;
        this.max_elements = max_elements;
        this.max_depth = max_depth;

        this.qnodes.insert();
        this.qnodes.set(0, qnode_idx_fc, -1);
        this.qnodes.set(0, qnode_idx_num_children, 0);  
    }

    /**
     * Insert the element specified by the ID and the bound to the Quadtree.  
     * @param id 
     * @param lft 
     * @param top 
     * @param rgt 
     * @param btm 
     */

    insert(id: number, lft: number, top: number, rgt: number, btm: number): number {
        const new_elt_index = this.elts.insert(); 

        this.elts.set(new_elt_index, elt_idx_lft, Math.floor(lft));
        this.elts.set(new_elt_index, elt_idx_top, Math.floor(top));
        this.elts.set(new_elt_index, elt_idx_rgt, Math.floor(rgt));
        this.elts.set(new_elt_index, elt_idx_btm, Math.floor(btm));
        this.elts.set(new_elt_index, elt_idx_id, id); 

        this.insert_qnode(0, 0, this.root_mx, this.root_my, this.root_sx, this.root_sy, new_elt_index); 
        return new_elt_index; 
    }

    /**
     * Remove a given element from the quadtree. Maintain the quadtree structure. 
     * @param element An element's id
     */
    remove(element: number): void {
        const lft = this.elts.get(element, elt_idx_lft);
        const top = this.elts.get(element, elt_idx_top);
        const rgt = this.elts.get(element, elt_idx_rgt);
        const btm = this.elts.get(element, elt_idx_btm);
        let leaves = this.find_leaves(0, 0, this.root_mx, this.root_my, this.root_sx, this.root_sy, lft, top, rgt, btm);
        for (let i = 0; i < leaves.size(); i++) {
            const nd_index = leaves.get(i, qnd_idx_index);

            let current_index = this.qnodes.get(nd_index, qnode_idx_fc);
            let prev_index = -1; 

            while (current_index != -1 && this.enodes.get(current_index, enode_idx_elt) != element) {
                prev_index = current_index;
                current_index = this.enodes.get(current_index, enode_idx_next);
            }

            if (current_index !== -1) {
                const next_index = this.enodes.get(current_index, enode_idx_next);
                if (prev_index === -1) {
                    this.qnodes.set(nd_index, qnode_idx_fc, next_index);
                } else {
                    this.enodes.set(prev_index, enode_idx_next, next_index);
                }
                this.enodes.remove(current_index);
                this.qnodes.set(nd_index, qnode_idx_num_children, this.qnodes.get(nd_index, qnode_idx_num_children) - 1); 
            }
        }
        this.elts.remove(element); 
    }

    /**
     * Cleanup process to remove empty leaves
     */

    cleanup(): void {
        let to_process = new IntList(1);
        if (this.qnodes.get(0, qnode_idx_num_children) === -1) {
            to_process.set(to_process.push(), 0, 0);
        }

        while (to_process.size()) {
            const node = to_process.get(to_process.size() - 1, 0);
            const fc = this.qnodes.get(node, qnode_idx_fc);
            let num_empty_leaves = 0; 
            to_process.pop(); 

            for (let i = 0; i < 4; i++) {
                if (this.qnodes.get(fc+i, qnode_idx_num_children) === 0) {
                    num_empty_leaves++; 
                } else if (this.qnodes.get(fc+i, qnode_idx_num_children) === -1) {
                    to_process.set(to_process.push(), 0, fc+i);
                }
            }

            if (num_empty_leaves === 4) {
                this.qnodes.remove(fc + 3);
                this.qnodes.remove(fc + 2);
                this.qnodes.remove(fc + 1);
                this.qnodes.remove(fc + 0);

                this.qnodes.set(node, qnode_idx_fc, -1);
                this.qnodes.set(node, qnode_idx_num_children, 0);
            }
        }
    }

    /**
     * Query the quadtree to find all elements in a specified AABB
     * @param bd 
     * @param omit_ele 
     * @returns A list of element id that can intersect with the input AABB. 
     */

    query(bd: Bound, omit_ele?: number[]): number[] {
        let out: number[] = []; 
        let affected: number[] = []; 

        const qlft = Math.floor(bd.min_x);
        const qtop = Math.floor(bd.min_y);
        const qrgt = Math.floor(bd.max_x);
        const qbtm = Math.floor(bd.max_y);
        let leaves = this.find_leaves(0, 0, this.root_mx, this.root_mx, this.root_sx, this.root_sy, qlft, qtop, qrgt, qbtm);

        if (!this.temp || this.temp.length < this.elts.size()) {
            this.temp = new Array(this.elts.size()); 
        }

        for (let i = 0; i < leaves.size(); i++) {
            const nd_index = leaves.get(i, qnd_idx_index);

            let current_enode_index = this.qnodes.get(nd_index, qnode_idx_fc);
            while (current_enode_index !== -1) {
                const element = this.enodes.get(current_enode_index, enode_idx_elt);
                const lft = this.elts.get(element, elt_idx_lft);
                const rgt = this.elts.get(element, elt_idx_rgt);
                const top = this.elts.get(element, elt_idx_top);
                const btm = this.elts.get(element, elt_idx_btm);

                if (!this.temp[element] && !(omit_ele?.includes(element)) && Quadtree.intersect(qlft, qtop, qrgt, qbtm, lft, top, rgt, btm)) {
                    out.push(this.elts.get(element, elt_idx_id)); 
                    affected.push(element); 
                    this.temp[element] = true; 
                }
                current_enode_index = this.enodes.get(current_enode_index, enode_idx_next); 
            }
        }

        for (let i = 0; i < affected.length; i++) {
            this.temp[affected[i]] = false; 
        }

        return out; 
    }

    /**
     * Checks if two AABBs intersect
     * @param l1 
     * @param t1 
     * @param r1 
     * @param b1 
     * @param l2 
     * @param t2 
     * @param r2 
     * @param b2 
     * @returns True if the two AABB intersect with each other, false otherwise. 
     */

    private static intersect(l1: number, t1: number, r1: number, b1: number,
                    l2: number, t2: number, r2: number, b2: number): boolean {
        return l2 <= r1 && r2 >= l1 && t2 <= b1 && b2 >= t1; 
    }

    /**
     * Insert a quad node 
     * @param index 
     * @param depth 
     * @param mx 
     * @param my 
     * @param sx 
     * @param sy 
     * @param elementIndex 
     */
    
    private insert_qnode(index: number, depth: number, 
        mx: number, my: number, sx: number, sy: number, elementIndex: number): void {

        const lft = this.elts.get(elementIndex, elt_idx_lft);
        const rgt = this.elts.get(elementIndex, elt_idx_rgt);
        const top = this.elts.get(elementIndex, elt_idx_top);
        const btm = this.elts.get(elementIndex, elt_idx_btm);
        let leaves = this.find_leaves(index, depth, mx, my, sx, sy, lft, top, rgt, btm); 

        for (let i = 0; i < leaves.size(); i++) {
            const nd_mx = leaves.get(i, qnd_idx_mx);
            const nd_my = leaves.get(i, qnd_idx_my);
            const nd_sx = leaves.get(i, qnd_idx_sx);
            const nd_sy = leaves.get(i, qnd_idx_sy);
            const nd_index = leaves.get(i, qnd_idx_index);
            const nd_depth = leaves.get(i, qnd_idx_depth);
            this.insert_to_leaf(nd_index, nd_depth, nd_mx, nd_my, nd_sx, nd_sy, elementIndex); 
        }

    } 

    /**
     * Helper function to find the leaves a given quad node intersects with. 
     * @param node 
     * @param depth 
     * @param mx 
     * @param my 
     * @param sx 
     * @param sy 
     * @param lft 
     * @param top 
     * @param rgt 
     * @param btm 
     * @returns A list of leaf qnd nodes. 
     */

    private find_leaves(node: number, depth: number, 
        mx: number, my: number, sx: number, sy: number, 
                lft: number, top: number, rgt: number, btm: number): IntList {
                    
        let leaves = new IntList(qnd_num); 
        let to_process = new IntList(qnd_num);
        Quadtree.push_node(to_process, node, depth, mx, my, sx, sy); 
        
        while (to_process.size()) {
            const back_idx = to_process.size() - 1; 
            const nd_mx = to_process.get(back_idx, qnd_idx_mx);
            const nd_my = to_process.get(back_idx, qnd_idx_my);
            const nd_sx = to_process.get(back_idx, qnd_idx_sx);
            const nd_sy = to_process.get(back_idx, qnd_idx_sy);
            const nd_index = to_process.get(back_idx, qnd_idx_index);
            const nd_depth = to_process.get(back_idx, qnd_idx_depth);
            to_process.pop(); 

            if (this.qnodes.get(nd_index, qnode_idx_num_children) !== -1) {
                Quadtree.push_node(leaves, nd_index, nd_depth, nd_mx, nd_my, nd_sx, nd_sy); 
            } else {
                const fc = this.qnodes.get(nd_index, qnode_idx_fc);
                const hx = nd_sx / 2;
                const hy = nd_sy / 2; 
                const l = nd_mx - hx; 
                const t = nd_my - hy; 
                const r = nd_mx + hx; 
                const b = nd_my + hy; 

                if (top <= nd_my) {
                    if (lft <= nd_mx)
                        Quadtree.push_node(to_process, fc+0, nd_depth+1, l, t, hx, hy);
                    if (rgt > nd_mx)
                        Quadtree.push_node(to_process, fc+1, nd_depth+1, r, t, hx, hy); 
                } 
                if (btm > nd_my) {
                    if (lft <= nd_mx)
                        Quadtree.push_node(to_process, fc+2, nd_depth+1, l, b, hx, hy);
                    if (rgt > nd_mx)
                        Quadtree.push_node(to_process, fc+3, nd_depth+1, r, b, hx, hy);  
                }
            }
        }
        return leaves; 
    }


    /**
     * Insert an element to a leaf. If the specified leaf reaches the max_element limit, split it and maintain the quadtree structure. 
     * @param node 
     * @param depth 
     * @param mx 
     * @param my 
     * @param sx 
     * @param sy 
     * @param elementIndex 
     */
    private insert_to_leaf(node: number, depth: number, 
                            mx: number, my: number, sx: number, sy: number, elementIndex: number) {

        const qn_fc = this.qnodes.get(node, qnode_idx_fc);
        this.qnodes.set(node, qnode_idx_fc, this.enodes.insert()); 
        this.enodes.set(this.qnodes.get(node, qnode_idx_fc), enode_idx_next, qn_fc);
        this.enodes.set(this.qnodes.get(node, qnode_idx_fc), enode_idx_elt, elementIndex);

        if (this.qnodes.get(node, qnode_idx_num_children) == this.max_elements && depth < this.max_depth) {
            let temp_elts = new IntList(1);
            while (this.qnodes.get(node, qnode_idx_fc) != -1) {
                const index = this.qnodes.get(node, qnode_idx_fc);
                const e_next_index = this.enodes.get(index, enode_idx_next);
                const elt = this.enodes.get(index, enode_idx_elt); 

                this.qnodes.set(node, qnode_idx_fc, e_next_index);
                this.enodes.remove(index);

                temp_elts.set(temp_elts.push(), 0, elt); 
            }

            const fc = this.qnodes.insert(); 
            this.qnodes.insert();
            this.qnodes.insert();
            this.qnodes.insert();
            this.qnodes.set(node, qnode_idx_fc, fc); 
            
            for (let i = 0; i < 4; ++i) {
                this.qnodes.set(fc+i, qnode_idx_fc, -1); 
                this.qnodes.set(fc+i, qnode_idx_num_children, 0);
            }

            this.qnodes.set(node, qnode_idx_num_children, -1);
            for (let i = 0; i < temp_elts.size(); ++i) {
                this.insert_qnode(node, depth, mx, my, sx, sy, temp_elts.get(i, 0)); 
            } 
        } else {
            this.qnodes.set(node, qnode_idx_num_children, this.qnodes.get(node, qnode_idx_num_children) + 1); 
        }
    }

    /**
     * Helper function to insert a quad node's data into the specified list. 
     * @param lst 
     * @param nd_index 
     * @param nd_depth 
     * @param nd_mx 
     * @param nd_my 
     * @param nd_sx 
     * @param nd_sy 
     */
    private static push_node(lst: IntList, nd_index: number, nd_depth: 
                            number, nd_mx: number, nd_my: number, nd_sx: number, nd_sy: number): void {
        const new_nd_idx = lst.push(); 
        lst.set(new_nd_idx, qnd_idx_mx, nd_mx);
        lst.set(new_nd_idx, qnd_idx_my, nd_my);
        lst.set(new_nd_idx, qnd_idx_sx, nd_sx);
        lst.set(new_nd_idx, qnd_idx_sy, nd_sy);
        lst.set(new_nd_idx, qnd_idx_index, nd_index);
        lst.set(new_nd_idx, qnd_idx_depth, nd_depth);
    }

    
}