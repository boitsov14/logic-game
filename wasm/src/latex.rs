use crate::lang::{Formula, Sequent, Term};
use itertools::Itertools;
use wasm_bindgen::prelude::*;

impl Formula {
    fn write(&self, f: &mut std::fmt::Formatter, is_inner: bool) -> std::fmt::Result {
        use Formula::*;
        match self {
            True => write!(f, r"\top")?,
            False => write!(f, r"\bot")?,
            Pred(id, ts) if ts.is_empty() => write!(f, "{id}")?,
            Pred(id, ts) => write!(
                f,
                "{id}({})",
                ts.iter().map(|t| t.to_string()).collect_vec().join(",")
            )?,
            Not(p) => {
                write!(f, r"\lnot ")?;
                p.write(f, true)?;
            }
            And(p, q) => {
                if is_inner {
                    write!(f, "(")?;
                }
                p.write(f, true)?;
                write!(f, r" \land ")?;
                q.write(f, true)?;
                if is_inner {
                    write!(f, ")")?;
                }
            }
            Or(p, q) => {
                if is_inner {
                    write!(f, "(")?;
                }
                p.write(f, true)?;
                write!(f, r" \lor ")?;
                q.write(f, true)?;
                if is_inner {
                    write!(f, ")")?;
                }
            }
            To(p, q) => {
                if is_inner {
                    write!(f, "(")?;
                }
                p.write(f, true)?;
                write!(f, r" \rightarrow ")?;
                q.write(f, true)?;
                if is_inner {
                    write!(f, ")")?;
                }
            }
            Iff(p, q) => {
                if is_inner {
                    write!(f, "(")?;
                }
                p.write(f, true)?;
                write!(f, r" \leftrightarrow ")?;
                q.write(f, true)?;
                if is_inner {
                    write!(f, ")")?;
                }
            }
            All(x, p) => {
                write!(f, r"\forall {x}")?;
                p.write(f, true)?;
            }
            Ex(x, p) => {
                write!(f, r"\exists {x}")?;
                p.write(f, true)?;
            }
        }
        Ok(())
    }
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

impl std::fmt::Display for Formula {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        self.write(f, false)
    }
}

impl std::fmt::Display for Sequent {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(
            f,
            r"{} \vdash {}",
            self.ants
                .iter()
                .map(|p| p.to_string())
                .collect_vec()
                .join(", "),
            self.suc.to_string()
        )
    }
}

#[wasm_bindgen]
pub fn to_latex_fml(fml: Formula) -> String {
    fml.to_string()
}

#[wasm_bindgen]
pub fn to_latex_seq(seq: Sequent) -> String {
    seq.to_string()
}
