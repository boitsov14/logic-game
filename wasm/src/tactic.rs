#![allow(non_snake_case)]
use crate::lang::{Formula, Sequent, Term};
use serde::{Deserialize, Serialize};
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[derive(Debug, strum::Display)]
#[strum(serialize_all = "snake_case")]
#[wasm_bindgen]
pub enum Tactic {
    Assumption,
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

#[derive(Debug, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub enum Result {
    Done,
    Subgoal(Sequent),
    Subgoals((Sequent, Sequent)),
    Candidates(Vec<Formula>),
}

#[wasm_bindgen]
pub fn apply(
    tactic: Tactic,
    mut sequent: Sequent,
    fml1: Option<Formula>,
    fml2: Option<Formula>,
    term: Option<Term>,
) -> Result {
    use Formula::*;
    use Tactic::*;
    match tactic {
        Assumption => Result::Done,
        Intro => {
            let fml = sequent.suc;
            match fml {
                Not(p) => {
                    sequent.ant.push(*p);
                    sequent.suc = False;
                    Result::Subgoal(sequent)
                }
                To(p, q) => {
                    sequent.ant.push(*p);
                    sequent.suc = *q;
                    Result::Subgoal(sequent)
                }
                All(x, p) => {
                    // TODO: 2024/06/24
                    todo!()
                }
                _ => unreachable!("inappropriate formula"),
            }
        }
        Apply => todo!(),
        Have => todo!(),
        Constructor => todo!(),
        Cases => todo!(),
        Left => todo!(),
        Right => todo!(),
        Use => todo!(),
        Trivial => todo!(),
        Exfalso => todo!(),
        ByContra => todo!(),
    }
}
