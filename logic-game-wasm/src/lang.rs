#[derive(Clone, Debug, Eq, Hash, PartialEq)]
pub enum Term {
    Var(String),
    Func(String, Vec<Term>),
}

#[derive(Clone, Debug, Eq, PartialEq)]
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

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Sequent {
    pub ant: Vec<Formula>,
    pub suc: Vec<Formula>,
}
