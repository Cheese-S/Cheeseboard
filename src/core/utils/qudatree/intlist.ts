class IntList {
    private data: Int32Array = new Int32Array(128);
    private num_fields: number = 0;
    private num: number = 0;
    private cap: number = 128;
    private free_element: number = -1;

    constructor(num_fields: number) {
        this.num_fields = num_fields;
    }

    size(): number {
        return this.num; 
    }

    get(n: number, field: number): number {
        if (n >= 0 && n < this.num && field >= 0 && field < this.num_fields) {
            return this.data[n*this.num_fields + field]; 
        } else {
            throw Error(`IntList data access error: n: ${n}, field: ${field}`); 
        }
    }

    set(n:number, field: number, val: number): void {
        if (n >= 0 && n < this.num && field >= 0 && field < this.num_fields) {
            this.data[n*this.num_fields + field] = val; 
        } else {
            throw Error(`IntList data access error: n: ${n}, field: ${field}`); 
        }
    }

    clear(): void {
        this.num = 0;
        this.free_element = -1; 
    }

    push(): number {
        const new_pos = (this.num + 1) * this.num_fields;
        
        if (new_pos > this.cap) {
            
        }
    }

    
}