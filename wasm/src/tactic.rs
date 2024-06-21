use wasm_bindgen::prelude::*;

#[derive(Debug)]
#[wasm_bindgen]
pub enum Tactic {
    Exact,
    Intro,
    Apply,
    Have,
    Constructor,
    Cases,
    Left,
    Right,
    Use,
    Trivial,
    Exfalso,
    ByContra,
}
