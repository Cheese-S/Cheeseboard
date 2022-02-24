export default class IntList {
    private num_fields: number = 0;
    private num: number = 0;
    private max_element: number = 128;
    private free_element: number = -1;
    private data: Int32Array = new Int32Array(this.max_element);


    /**
     * Construct a IntList where each element has specified number of fields
     * @param num_fields 
     */
    constructor(num_fields: number) {
        this.num_fields = num_fields;
    }

    /**
     * Returns the size of the IntList 
     * @returns IntList size
     */
    size(): number {
        return this.num; 
    }

    /**
     * Returns the nth element's specified field 
     * @param n 
     * @param field 
     * @returns Integer
     */

    get(n: number, field: number): number {
        if (n >= 0 && n < this.num && field >= 0 && field < this.num_fields) {
            return this.data[n*this.num_fields + field]; 
        } else {
            throw Error(`IntList data access error: n: ${n}, field: ${field}`); 
        }
    }

    /**
     * Set the nth element's specifed field with val
     * @param n 
     * @param field 
     * @param val 
     */

    set(n:number, field: number, val: number): void {
        if (n >= 0 && n < this.num && field >= 0 && field < this.num_fields) {
            this.data[n*this.num_fields + field] = val; 
        } else {
            throw Error(`IntList data access error: n: ${n}, field: ${field}`); 
        }
    }


    /**
     * Reset the IntList 
     */
    clear(): void {
        this.num = 0;
        this.free_element = -1; 
    }

    /**
     * STACK METHOD. DO NOT MIX USE WITH FREE LIST METHOD.
     * Push an element to the back of the list and return its index
     * @returns index of the newly inserted element 
     */
    push(): number {
        const new_pos = (this.num + 1) * this.num_fields;
        
        if (new_pos > this.max_element) {
            const new_max = this.max_element * 2;
            let new_data = new Int32Array(new_max);
            new_data.set(this.data);
            this.data = new_data;
            this.max_element = new_max;
        }
        return this.num++; 
    }

    /**
     * STACK METHOD. DO NOT MIX USE WITH FREE LIST METHOD.
     * Pop an element from the back of the stack. 
     */

    pop(): void {
        if (this.num <= 0) {
            throw Error("IntList Pop Error: no elements to pop");
        }
        --this.num;
    }

    /**
     * FREE LIST METHOD. DO NOT MIX USE WITH STACK METHOD.
     * Insert an element to the list.
     * @returns 
     */

    insert(): number {
        if (this.free_element !== -1) {
            const index = this.free_element;
            const pos = index * this.num_fields;
            this.free_element = this.data[pos];
            return index; 
        }
        return this.push(); 
    }

    /**
     * FREE LIST METHOD. DO NOT MIX USE WITH STACK METHOD.
     * Remove the nth element from the list. 
     * @param n 
     */

    remove(n: number) {
        const pos = n * this.num_fields;
        this.data[pos] = this.free_element;
        this.free_element = n; 
    }

    
}