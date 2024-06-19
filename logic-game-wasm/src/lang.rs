use itertools::Itertools;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Eq, Hash, PartialEq, Serialize, Deserialize)]
pub enum Term {
    Var(String),
    Func(String, Vec<Term>),
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
pub enum Formula {
    True,
    False,
    Pred(String, Vec<Term>),
    Not(Box<Formula>),
    And(Box<Formula>, Box<Formula>),
    Or(Box<Formula>, Box<Formula>),
    To(Box<Formula>, Box<Formula>),
    Iff(Box<Formula>, Box<Formula>),
    All(String, Box<Formula>),
    Ex(String, Box<Formula>),
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
pub struct Sequent {
    pub ant: Vec<Formula>,
    pub suc: Vec<Formula>,
}

impl std::fmt::Display for Term {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            Term::Var(id) => write!(f, "{id}"),
            Term::Func(id, ts) => write!(
                f,
                "{id}({})",
                ts.iter().map(|t| t.to_string()).collect_vec().join(",")
            ),
        }
    }
}
