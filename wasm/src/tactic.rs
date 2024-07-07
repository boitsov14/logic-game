#![allow(non_snake_case)]
use crate::lang::{Formula, Sequent, Term};
use serde::{Deserialize, Serialize};
use strum::IntoEnumIterator;
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[derive(Clone, Copy, Debug, strum::EnumIter)]
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
                if seq.ants.contains(&seq.suc) {
                    let candidate = Candidate::new(tactic, None, None, None, Done);
                    candidates.push(candidate);
                }
            }
            Intro => {
                let mut seq = seq.clone();
                match seq.suc {
                    Not(p) => {
                        seq.ants.push(*p);
                        seq.suc = False;
                        let candidate = Candidate::new(tactic, None, None, None, Subgoal(seq));
                        candidates.push(candidate);
                    }
                    To(p, q) => {
                        seq.ants.push(*p);
                        seq.suc = *q;
                        let candidate = Candidate::new(tactic, None, None, None, Subgoal(seq));
                        candidates.push(candidate);
                    }
                    All(x, p) => todo!(),
                    _ => {}
                }
            }
            Apply => {
                for ant in seq.ants.iter() {
                    let mut seq = seq.clone();
                    match ant {
                        Not(p) if seq.suc == False => {
                            seq.suc = *p.clone();
                            let candidate =
                                Candidate::new(tactic, Some(ant.clone()), None, None, Subgoal(seq));
                            candidates.push(candidate);
                        }
                        To(p, q) if seq.suc == **q => {
                            seq.suc = *p.clone();
                            let candidate =
                                Candidate::new(tactic, Some(ant.clone()), None, None, Subgoal(seq));
                            candidates.push(candidate);
                        }
                        All(x, p) => todo!(),
                        _ => {}
                    }
                }
            }
            Have => {
                for ant in seq.ants.iter() {
                    match ant {
                        Not(p) => {
                            if seq.ants.contains(p) {
                                let mut seq = seq.clone();
                                seq.ants.push(False);
                                let candidate = Candidate::new(
                                    tactic,
                                    Some(ant.clone()),
                                    Some(*p.clone()),
                                    None,
                                    Subgoal(seq),
                                );
                                candidates.push(candidate);
                            }
                        }
                        To(p, q) => {
                            if seq.ants.contains(p) {
                                let mut seq = seq.clone();
                                seq.ants.push(*q.clone());
                                let candidate = Candidate::new(
                                    tactic,
                                    Some(ant.clone()),
                                    Some(*p.clone()),
                                    None,
                                    Subgoal(seq),
                                );
                                candidates.push(candidate);
                            } else {
                                let mut seq1 = seq.clone();
                                let mut seq2 = seq.clone();
                                seq1.suc = *p.clone();
                                seq2.ants.retain(|fml| fml != ant);
                                seq2.ants.push(*q.clone());
                                let candidate = Candidate::new(
                                    tactic,
                                    Some(ant.clone()),
                                    None,
                                    None,
                                    Subgoals((seq1, seq2)),
                                );
                                candidates.push(candidate);
                            }
                        }
                        All(x, p) => todo!(),
                        _ => {}
                    }
                }
            }
            Constructor => {
                let mut seq1 = seq.clone();
                let mut seq2 = seq.clone();
                match seq.suc {
                    And(ref p, ref q) => {
                        seq1.suc = *p.clone();
                        seq2.suc = *q.clone();
                        let candidate =
                            Candidate::new(tactic, None, None, None, Subgoals((seq1, seq2)));
                        candidates.push(candidate);
                    }
                    Iff(ref p, ref q) => {
                        seq1.suc = To(Box::new(*p.clone()), Box::new(*q.clone()));
                        seq2.suc = To(Box::new(*q.clone()), Box::new(*p.clone()));
                        let candidate =
                            Candidate::new(tactic, None, None, None, Subgoals((seq1, seq2)));
                        candidates.push(candidate);
                    }
                    _ => {}
                }
            }
            Cases => {
                for ant in seq.ants.iter() {
                    match ant {
                        And(p, q) => {
                            let mut seq = seq.clone();
                            seq.ants.retain(|fml| fml != ant);
                            seq.ants.push(*p.clone());
                            seq.ants.push(*q.clone());
                            let candidate =
                                Candidate::new(tactic, Some(ant.clone()), None, None, Subgoal(seq));
                            candidates.push(candidate);
                        }
                        Or(p, q) => {
                            let mut seq1 = seq.clone();
                            seq1.ants.retain(|fml| fml != ant);
                            let mut seq2 = seq1.clone();
                            seq1.ants.push(*p.clone());
                            seq2.ants.push(*q.clone());
                            let candidate = Candidate::new(
                                tactic,
                                Some(ant.clone()),
                                None,
                                None,
                                Subgoals((seq1, seq2)),
                            );
                            candidates.push(candidate);
                        }
                        Iff(p, q) => {
                            let mut seq = seq.clone();
                            seq.ants.retain(|fml| fml != ant);
                            seq.ants
                                .push(To(Box::new(*p.clone()), Box::new(*q.clone())));
                            seq.ants
                                .push(To(Box::new(*q.clone()), Box::new(*p.clone())));
                            let candidate =
                                Candidate::new(tactic, Some(ant.clone()), None, None, Subgoal(seq));
                            candidates.push(candidate);
                        }
                        Ex(x, p) => todo!(),
                        _ => {}
                    }
                }
            }
            Left => {
                if let Or(ref p, _) = seq.suc {
                    let mut seq = seq.clone();
                    seq.suc = *p.clone();
                    let candidate = Candidate::new(tactic, None, None, None, Subgoal(seq));
                    candidates.push(candidate);
                }
            }
            Right => {
                if let Or(_, ref q) = seq.suc {
                    let mut seq = seq.clone();
                    seq.suc = *q.clone();
                    let candidate = Candidate::new(tactic, None, None, None, Subgoal(seq));
                    candidates.push(candidate);
                }
            }
            Use => {
                if let Ex(x, p) = seq.suc {
                    todo!()
                }
            }
            Trivial => {
                if seq.suc == True || seq.ants.contains(&False) {
                    let candidate = Candidate::new(tactic, None, None, None, Done);
                    candidates.push(candidate);
                    continue;
                }
                for fml in seq.ants.iter() {
                    if seq.ants.contains(&Not(Box::new(fml.clone()))) {
                        let candidate = Candidate::new(tactic, None, None, None, Done);
                        candidates.push(candidate);
                        break;
                    }
                }
            }
            Exfalso => {
                let mut seq = seq.clone();
                seq.suc = False;
                let candidate = Candidate::new(tactic, None, None, None, Subgoal(seq));
                candidates.push(candidate);
            }
            ByContra => {
                let mut seq = seq.clone();
                let fml = Not(Box::new(seq.suc));
                seq.ants.push(fml);
                seq.suc = False;
                let candidate = Candidate::new(tactic, None, None, None, Subgoal(seq));
                candidates.push(candidate);
            }
        }
    }
    candidates
}
