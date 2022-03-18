import { Quadtree } from ".";
import { Bound } from "../../type"


let getBound = (a: number, b: number, c: number, d: number): Bound => {
    return {min_x: a, max_y: b, max_x: c, min_y: d}; 
}

describe('Query Points in Quadtree', () => {
    let q: Quadtree;
    beforeAll(() => {
        q = new Quadtree(1000, 1000, 4, 10); 
        q.insert(1, 300, 300, 300,300); 
        q.insert(2, 400, 400, 400,400); 
        q.insert(3, 600, 600, 600,600); 
        q.insert(4, 700, 700, 700,700); 
    })

    test('Quadrants', () => {
        expect(q.query(getBound(0, 0, 500, 500)).sort()).toEqual([1,2]); 
        expect(q.query(getBound(500, 500, 1000, 1000)).sort()).toEqual([3,4]); 
    })

    test('Inter Quadrants',() => {
        expect(q.query(getBound(0, 0, 1000, 1000)).sort()).toEqual([1,2,3,4]); 
        expect(q.query(getBound(350, 350, 750, 750)).sort()).toEqual([2,3,4]);
    })

    test('Points on Edge',() => {
        expect(q.query(getBound(300, 300, 400, 400)).sort()).toEqual([1,2]); 
        expect(q.query(getBound(300, 300, 700, 700)).sort()).toEqual([1,2,3,4]);
        expect(q.query(getBound(300, 250, 300, 350)).sort()).toEqual([1]); 
    })

    test('Point on Point',() => {
        expect(q.query(getBound(300, 300, 300, 300)).sort()).toEqual([1]); 
        expect(q.query(getBound(600, 600, 600, 600)).sort()).toEqual([3]);
    })

    test('Query Empty Space', () => {
        expect(q.query(getBound(0, 0, 0, 0)).sort()).toEqual([]); 
    })

});

describe('Query AABB in Quadtree', () => {
    let q: Quadtree;
    beforeAll(() => {
        q = new Quadtree(1000, 1000, 2, 10); 
        q.insert(1, 0, 0, 250,250); 
        q.insert(2, 250, 250, 500,500); 
        q.insert(3, 500, 500, 750,750); 
        q.insert(4, 750, 750, 1000,1000); 
    })

    test('AABB in AABB', () => {
        expect(q.query(getBound(100, 100, 200, 200)).sort()).toEqual([1]); 
        expect(q.query(getBound(600, 600, 700, 700)).sort()).toEqual([3]); 
    });

    test('AABB intersects with AABBs', () => {
        expect(q.query(getBound(100, 100, 300, 300)).sort()).toEqual([1, 2]); 
        expect(q.query(getBound(300, 300, 700, 700)).sort()).toEqual([2, 3]); 
    });

    test('Different Quadrants', () => {
        expect(q.query(getBound(0, 0, 1000, 1000)).sort()).toEqual([1, 2, 3, 4]); 
    });

    test('Query After Deletion', () => {
        q.remove(1);
        expect(q.query(getBound(0, 0, 1000, 1000)).sort()).toEqual([2, 3, 4]); 
    })
});

