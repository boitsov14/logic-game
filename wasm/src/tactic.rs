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
    Candidates(Vec<Formula>),
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
    candidates
}

// TODO: 2024/06/25 削除予定
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
                _ => unreachable!("invalid tactic"),
            }
        }
        Apply => {
            match fml1 {
                Some(fml) => {
                    match fml {
                        Not(p) => {
                            sequent.suc = *p;
                            Result::Subgoal(sequent)
                        }
                        To(p, _) => {
                            sequent.suc = *p;
                            Result::Subgoal(sequent)
                        }
                        All(x, p) => {
                            // TODO: 2024/06/24
                            todo!()
                        }
                        _ => unreachable!("invalid tactic"),
                    }
                }
                None => {
                    let mut fmls = vec![];
                    for fml in sequent.ant.iter() {
                        match fml {
                            Not(p) => {
                                if sequent.suc == False {
                                    fmls.push(*p.clone());
                                }
                            }
                            To(p, q) => {
                                if sequent.suc == **q {
                                    fmls.push(*p.clone());
                                }
                            }
                            All(x, p) => {}
                            _ => {}
                        }
                    }
                    Result::Candidates(fmls)
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
