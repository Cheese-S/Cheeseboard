import { point } from "../../type";
import IntList from "./intlist";

/* ----------------------------- QUADNODE FIELDS ---------------------------- */

// Points to the first child if the node is a branch node. 
// Points to the first element if the node is a leaf node.
const qn_fc = 0;

// Points to the number of elements in the node. -1 if the node is not a leaf node. 
const qn_num = 1;

/* -------------------------- QUADNODE DATA FIELDS -------------------------- */

// number of fields 
const qn_field_num = 6; 

// Points to a quadnode's AABB stored as (center, halfsize)
const qn_mx = 0;
const qn_my = 1;
const qn_sx = 2;
const qn_sy = 3;

// Points to a quadnode's index
const qn_idx = 4;

// Points to a quadnode's depth
const qn_depth = 5;

/* --------------------------- ELEMENT NODE FIELDS -------------------------- */

// Points to the next element in the leaf node. -1 indicates the end of the list.
const enode_next = 0 ;

// Stores the element index  
const enode_elt = 1;  

/* ----------------------------- ELEMENT DATA FIELDS ----------------------------- */

// Stores the AABB 
const elt_lft = 0;
const elt_top = 1;
const elt_rgt = 2;
const elt_btm = 3;

// Stores the element id
const elt_id = 4; 

class Quadtree {

    /* --------------------------- QUADTREE ATTRIBUTES -------------------------- */

    // Max element a leaf can store before splitting.
    private max_elem: number;

    // Max depth the quadtree is allowed to be splitted to. 
    private max_depth: number;
    
    // Root's center and halfsize
    private root_mx: number;
    private root_my: number;
    private root_sx: number;
    private root_sy: number;
    
    // Buffer for queries
    private temp: boolean[]; 

    /* -------------------------------- QUADNODE -------------------------------- */
    private quad_nodes: IntList = new IntList(2);

    /* --------------------------------- ELEMENT -------------------------------- */
    private elts = new IntList(5);

    /**
     * Construct an element with the specified dimension, max_elem, and max_depth. 
     * @param w 
     * @param h 
     * @param max_elem 
     * @param max_depth 
     */
    constructor(w: number, h: number, max_elem: number, max_depth: number) {
        this.max_elem = max_elem;
        this.max_depth = max_depth;

        this.quad_nodes.insert(); 
        this.quad_nodes.set(0, qn_fc, -1);
        this.quad_nodes.set(0, qn_num, 0); 

        this.root_mx = this.root_sx = Math.floor(w / 2);
        this.root_my = this.root_sy = Math.floor(h / 2);
    }

    insert(id: number, lft: number, top: number, rgt: number, bot:number): number {
        const new_elt = this.elts.insert(); 

        this.elts.set(new_elt, elt_lft, Math.floor(lft));
        this.elts.set(new_elt, elt_top, Math.floor(top));
        this.elts.set(new_elt, elt_rgt, Math.floor(rgt));
        this.elts.set(new_elt, elt_btm, Math.floor(bot));
        this.elts.set(new_elt, elt_id, id);

        quad_node_insert(); 
        return new_elt; 
    }


    quad_node_insert(index: number, depth: number, 
                    mx: number, my: number, sx: number, sy: number, elt: number): void {
        const lft = this.elts.get(elt, elt_lft); 
        const top = this.elts.get(elt, elt_top); 
        const rgt = this.elts.get(elt, elt_rgt); 
        const btm = this.elts.get(elt, elt_btm);
        
        
    }

    find_leaves(node: number, depth:number, 
                mx: number, my: number, sx: number, sy: number,
                lft: number, top: number, rgt: number, bot: number): IntList {
                    
        let leaves = new IntList(qn_field_num);
        let process = new IntList(qn_field_num);
        Quadtree.push_node(process, node, depth, mx, my, sx, sy); 
        
        while (process.size()) {
            const current_idx = process.size() - 1; 
            const nd_mx = process.get(current_idx, qn_mx);
            const nd_my = process.get(current_idx, qn_my);
            const nd_sx = process.get(current_idx, qn_sx);
            const nd_sy = process.get(current_idx, qn_sy);
            const nd_idx = process.get(current_idx, qn_idx);
            const nd_depth = process.get(current_idx, qn_depth);
            process.pop();

            if (this.quad_nodes.get(nd_idx, qn_num) != -1) {
                Quadtree.push_node(leaves, nd_idx, nd_depth, nd_mx, nd_my, nd_sx, nd_sy);
            } else {
                
            }


        }



    }

    private static push_node(lst: IntList, index: number, depth: number, mx: number, my: number, sx: number, sy: number): void {
        const insert_idx = lst.insert();
        lst.set(insert_idx, qn_mx, mx);
        lst.set(insert_idx, qn_my, my);
        lst.set(insert_idx, qn_sx, sx);
        lst.set(insert_idx, qn_sy, sy);
        lst.set(insert_idx, qn_depth, depth);
        lst.set(insert_idx, qn_idx, index); 
    }









}