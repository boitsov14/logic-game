use wasm_bindgen::prelude::*;

#[derive(Debug, strum::Display)]
#[strum(serialize_all = "snake_case")]
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

#[wasm_bindgen]
pub fn display(tactic: Tactic) -> String {
    tactic.to_string()
}
