#![allow(non_snake_case)]
use serde::{Deserialize, Serialize};
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub enum Term {
    Var(String),
    Func(String, Vec<Term>),
}

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi, from_wasm_abi)]
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

#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct Sequent {
    pub ant: Vec<Formula>,
    pub suc: Formula,
}
