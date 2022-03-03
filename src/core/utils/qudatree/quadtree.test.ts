import { Quadtree } from ".";
import { bound } from "../../type"
let setup = () => {
    let q = new Quadtree(1000, 1000, 4, 10); 
    q.insert(1, 300, 300, 300,300); 
    q.insert(2, 400, 400, 400,400); 
    q.insert(3, 600, 600, 600,600); 
    q.insert(4, 700, 700, 700,700); 
    return q;
}

let getBound = (a: number, b: number, c: number, d: number): bound => {
    return {lft: a, top: b, rgt: c, btm: d}; 
}


test('quadtree init', () => {
    let q = setup(); 
    expect(q.query(getBound(0, 0, 500, 500))).toBe([1, 2]);
})