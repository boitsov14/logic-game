#![allow(non_snake_case)]
use crate::lang::{Formula, Sequent, Term};
use serde::{Deserialize, Serialize};
use strum::IntoEnumIterator;
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[derive(Clone, Copy, Debug, strum::Display, strum::EnumIter)]
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

#[derive(Clone, Debug, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub enum Result {
    Done,
    Subgoal(Sequent),
    Subgoals((Sequent, Sequent)),
}

#[wasm_bindgen(getter_with_clone)]
pub struct Candidate {
    pub tactic: Tactic,
    pub fml1: Option<Formula>,
    pub fml2: Option<Formula>,
    pub term: Option<Term>,
    pub result: Result,
}

impl Candidate {
    pub fn new(
        tactic: Tactic,
        fml1: Option<Formula>,
        fml2: Option<Formula>,
        term: Option<Term>,
        result: Result,
    ) -> Self {
        Self {
            tactic,
            fml1,
            fml2,
            term,
            result,
        }
    }
}

#[wasm_bindgen]
pub fn candidates(seq: Sequent) -> Vec<Candidate> {
    use self::Result::*;
    use Formula::*;
    use Tactic::*;
    let mut candidates = vec![];
    for tactic in Tactic::iter() {
        match tactic {
            Assumption => {
                if seq.ant.contains(&seq.suc) {
                    let candidate = Candidate::new(tactic, None, None, None, Done);
                    candidates.push(candidate);
                }
            }
            Intro => {
                let mut seq = seq.clone();
                match seq.suc {
                    Not(p) => {
                        seq.ant.push(*p);
                        seq.suc = False;
                        let candidate = Candidate::new(tactic, None, None, None, Subgoal(seq));
                        candidates.push(candidate);
                    }
                    To(p, q) => {
                        seq.ant.push(*p);
                        seq.suc = *q;
                        let candidate = Candidate::new(tactic, None, None, None, Subgoal(seq));
                        candidates.push(candidate);
                    }
                    All(x, p) => todo!(),
                    _ => {}
                }
            }
            Apply => {
                for fml in seq.ant.iter() {
                    let mut seq = seq.clone();
                    match fml {
                        Not(p) if seq.suc == False => {
                            seq.suc = *p.clone();
                            let candidate =
                                Candidate::new(tactic, Some(fml.clone()), None, None, Subgoal(seq));
                            candidates.push(candidate);
                        }
                        To(p, q) if seq.suc == **q => {
                            seq.suc = *p.clone();
                            let candidate =
                                Candidate::new(tactic, Some(fml.clone()), None, None, Subgoal(seq));
                            candidates.push(candidate);
                        }
                        All(x, p) => todo!(),
                        _ => {}
                    }
                }
            }
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
    candidates
}
