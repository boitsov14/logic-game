use crate::lang::{Formula, Sequent, Term};
use thiserror::Error;
use wasm_bindgen::prelude::*;

/// Parse error.
#[derive(Error, Debug)]
pub enum Error {
    /// Mismatched parentheses.
    #[error("Found {lp} left parentheses and {rp} right parentheses.")]
    Parentheses { lp: usize, rp: usize },
    /// Peg parser error.
    #[error("
 | 
 | {s}
 | {}^___
 | 
 = expected {}", " ".repeat(e.location.column - 1), e.expected)]
    Peg {
        s: String,
        e: peg::error::ParseError<peg::str::LineCol>,
    },
}

/// Parses a sequent.
#[wasm_bindgen]
pub fn parse_sequent(s: &str) -> Result<Sequent, String> {
    check_parentheses(&s).map_err(|e| e.to_string())?;
    let seq = parser::sequent(&s).map_err(|e| Error::Peg { s: s.into(), e }.to_string())?;
    Ok(seq)
}

/// Checks if the number of left and right parentheses are equal.
fn check_parentheses(s: &str) -> Result<(), Error> {
    let lp = s.chars().filter(|&c| c == '(').count();
    let rp = s.chars().filter(|&c| c == ')').count();
    if lp == rp {
        Ok(())
    } else {
        Err(Error::Parentheses { lp, rp })
    }
}

peg::parser!( grammar parser() for str {
    use Formula::*;
    use Term::*;

    /// Parses a term.
    pub(super) rule term() -> Term = quiet!{
        f:$func_id() _ "(" _ ts:(term() ++ (_ "," _)) _ ")" { Func(f.to_string(), ts) } /
        v:$var_id() { Var(v.to_string()) } /
        "(" t:term() ")" { t }
    } / expected!("term")

    rule predicate() -> Formula =
        p_true() { True.clone() } /
        p_false() { False.clone() } /
        p:$pred_id() _ "(" _ ts:(term() ++ (_ "," _)) _ ")" { Pred(p.to_string(), ts) } /
        p:$pred_id() { Pred(p.to_string(), vec![]) }

    /// Parses a formula.
    ///
    /// All infix operators are right-associative.
    ///
    /// The precedence of operators is as follows: ¬, ∀, ∃ > ∧ > ∨ > → > ↔.
    pub(super) rule formula() -> Formula = precedence!{
        p:@ _ iff() _ q:(@) { Iff(Box::new(p), Box::new(q)) }
        --
        p:@ _ to() _ q:(@) { To(Box::new(p), Box::new(q)) }
        --
        p:@ _ or() _ q:(@) { Or(Box::new(p), Box::new(q)) }
        --
        p:@ _ and() _ q:(@) { And(Box::new(p), Box::new(q)) }
        --
        not() _ p:@ { Not(Box::new(p)) }
        all() _ vs:($bdd_var_id() ++ (_ "," _)) _ p:@ { vs.iter().rev().fold(p, |p, s| All(s.to_string(), Box::new(p))) }
        ex() _ vs:($bdd_var_id() ++ (_ "," _)) _ p:@ { vs.iter().rev().fold(p, |p, s| Ex(s.to_string(), Box::new(p))) }
        --
        p:predicate() { p }
        "(" _ p:formula() _ ")" { p }
    } / expected!("formula")

    /// Parses a sequent.
    pub(super) rule sequent() -> Sequent =
        ant:(formula() ** (_ "," _)) _ turnstile() _ suc:(formula() ** (_ "," _)) { Sequent { ant, suc } } /
        p:formula() { Sequent { ant: vec![], suc: vec![p] } } /
        expected!("sequent")

    rule alpha() = [ 'a'..='z' | 'A'..='Z' ]
    rule digit() = [ '0'..='9' | '_' | '\'' ]
    rule id() = alpha() (alpha() / digit())*
    rule var_id() = id()
    rule bdd_var_id() = alpha() digit()*
    rule func_id() = id()
    rule pred_id() = quiet!{ id() } / expected!("predicate")
    rule p_true() = quiet!{ "⊤" / "true" / r"\top" }
    rule p_false() = quiet!{ "⊥" / "⟂" / "false" / r"\bot" }
    rule not() = quiet!{ "¬" / "~" / "not" / r"\lnot" / r"\neg" } / expected!(r#""¬""#)
    rule and() = quiet!{ "∧" / r"/\" / "&" / "and" / r"\land" / r"\wedge" } / expected!(r#""∧""#)
    rule or() = quiet!{ "∨" / r"\/" / "|" / "or" / r"\lor" / r"\vee" } / expected!(r#""∨""#)
    rule to() = quiet!{ "→" / "->" / "=>" / "to" / r"\rightarrow" / r"\to" } / expected!(r#""→""#)
    rule iff() = quiet!{ "↔" / "<->" / "<=>" / "iff" / r"\leftrightarrow" } / expected!(r#""↔""#)
    rule all() = quiet!{ "∀" / "!" / "all" / r"\forall" } / expected!(r#""∀""#)
    rule ex() = quiet!{ "∃" / "?" / "ex" / r"\exists" } / expected!(r#""∃""#)
    rule turnstile() = quiet!{ "⊢" / "|-" / "├" / "┣" / r"\vdash" } / expected!(r#""⊢""#)
    rule _ = quiet!{ [' ']* }
});

#[cfg(test)]
mod tests {
    use super::*;
    use test_case::case;

    fn term(s: &str) -> Term {
        parser::term(s).unwrap()
    }
    fn fml(s: &str) -> Formula {
        parser::formula(s).unwrap()
    }
    fn seq(s: &str) -> Sequent {
        parser::sequent(s).unwrap()
    }

    #[test]
    fn test_parse_term() {
        use Term::*;
        assert_eq!(term("x"), Var("x".into()));
        assert_eq!(term("f(x)"), Func("f".into(), vec![term("x")]));
        assert_eq!(
            term("f(x,g(y),z)"),
            Func("f".into(), vec![term("x"), term("g(y)"), term("z")])
        );
    }

    #[test]
    fn test_parse_fml() {
        use Formula::*;
        assert_eq!(fml("⊤"), True);
        assert_eq!(fml("⊥"), False);
        assert_eq!(fml("P"), Pred("P".into(), vec![]));
        assert_eq!(fml("P(x)"), Pred("P".into(), vec![term("x")]));
        assert_eq!(
            fml("P(x,f(y),z)"),
            Pred("P".into(), vec![term("x"), term("f(y)"), term("z")])
        );
        assert_eq!(fml("¬P"), Not(Box::new(fml("P"))));
        assert_eq!(fml("P ∧ Q"), And(Box::new(fml("P")), Box::new(fml("Q"))));
        assert_eq!(fml("P ∨ Q"), Or(Box::new(fml("P")), Box::new(fml("Q"))));
        assert_eq!(fml("P → Q"), To(Box::new(fml("P")), Box::new(fml("Q"))));
        assert_eq!(fml("P ↔ Q"), Iff(Box::new(fml("P")), Box::new(fml("Q"))));
        assert_eq!(fml("∀xP(x)"), All("x".into(), Box::new(fml("P(x)"))));
        assert_eq!(
            fml("∀x,yP(x,y)"),
            All(
                "x".into(),
                Box::new(All("y".into(), Box::new(fml("P(x,y)"))))
            )
        );
        assert_eq!(
            fml("∀x,y,zP(x,y,z)"),
            All(
                "x".into(),
                Box::new(All(
                    "y".into(),
                    Box::new(All("z".into(), Box::new(fml("P(x,y,z)"))))
                ))
            )
        );
        assert_eq!(fml("∃xP(x)"), Ex("x".into(), Box::new(fml("P(x)"))));
        assert_eq!(
            fml("∃x,yP(x,y)"),
            Ex(
                "x".into(),
                Box::new(Ex("y".into(), Box::new(fml("P(x,y)"))))
            )
        );
        assert_eq!(
            fml("∃x,y,zP(x,y,z)"),
            Ex(
                "x".into(),
                Box::new(Ex(
                    "y".into(),
                    Box::new(Ex("z".into(), Box::new(fml("P(x,y,z)"))))
                ))
            )
        );
    }

    #[test]
    fn test_parse_fml_assoc() {
        use Formula::*;
        assert_eq!(
            fml("P → Q → R"),
            To(
                Box::new(fml("P")),
                Box::new(To(Box::new(fml("Q")), Box::new(fml("R"))))
            )
        );
    }

    #[test]
    fn test_parse_fml_precedence() {
        use Formula::*;
        assert_eq!(
            fml("¬P ∧ Q ∨ R → S ↔ T"),
            Iff(
                Box::new(To(
                    Box::new(Or(
                        Box::new(And(Box::new(Not(Box::new(fml("P")))), Box::new(fml("Q")))),
                        Box::new(fml("R"))
                    )),
                    Box::new(fml("S"))
                )),
                Box::new(fml("T"))
            )
        );
        assert_eq!(
            fml("∀xP(x) → ∃yQ(y) → R"),
            To(
                Box::new(All("x".into(), Box::new(fml("P(x)")))),
                Box::new(To(
                    Box::new(Ex("y".into(), Box::new(fml("Q(y)")))),
                    Box::new(fml("R"))
                ))
            )
        )
    }

    #[test]
    fn test_parse_seq() {
        assert_eq!(
            seq("P, Q, R ⊢ S, T, U"),
            Sequent {
                ant: vec![fml("P"), fml("Q"), fml("R")],
                suc: vec![fml("S"), fml("T"), fml("U")]
            }
        );
        assert_eq!(
            seq("P, Q ⊢ R, S"),
            Sequent {
                ant: vec![fml("P"), fml("Q")],
                suc: vec![fml("R"), fml("S")]
            }
        );
        assert_eq!(
            seq("P ⊢ Q"),
            Sequent {
                ant: vec![fml("P")],
                suc: vec![fml("Q")]
            }
        );
        assert_eq!(
            seq("P ⊢"),
            Sequent {
                ant: vec![fml("P")],
                suc: vec![]
            }
        );
        assert_eq!(
            seq("⊢ P"),
            Sequent {
                ant: vec![],
                suc: vec![fml("P")]
            }
        );
        assert_eq!(
            seq("⊢"),
            Sequent {
                ant: vec![],
                suc: vec![]
            }
        );
        assert_eq!(
            seq("P ∧ Q, R ∨ S, ∀xP(x) ⊢ ∃yQ(y), ¬R, ∃z∀wS(z,w)"),
            Sequent {
                ant: vec![fml("P ∧ Q"), fml("R ∨ S"), fml("∀xP(x)")],
                suc: vec![fml("∃yQ(y)"), fml("¬R"), fml("∃z∀wS(z,w)")]
            }
        );
        assert_eq!(
            seq("P"),
            Sequent {
                ant: vec![],
                suc: vec![fml("P")]
            }
        );
        assert_eq!(
            seq("¬P ∧ Q ∨ R → S ↔ ∀x∃yP(x,y)"),
            Sequent {
                ant: vec![],
                suc: vec![fml("¬P ∧ Q ∨ R → S ↔ ∀x∃yP(x,y)")]
            }
        )
    }

    #[case("(((P)∧((Q))))" => r"P \land Q")]
    fn test_parse_fml2(s: &str) -> String {
        fml(s).to_string()
    }

    #[case("x")]
    #[case("f(x)")]
    #[case("f(x,y,z)")]
    #[case("f(x,g(y,h(x,z)))")]
    fn term_display(s: &str) {
        assert_eq!(term(s).to_string(), s);
    }

    #[case("P(x)")]
    #[case("P(x,y,z)")]
    #[case("P(x,f(y,g(z)))")]
    #[case(r"\lnot P")]
    #[case(r"P1 \land (Q \land (R \land S))")]
    #[case(r"P2 \lor (Q \lor (R \lor S))")]
    #[case(r"P3 \rightarrow (Q \rightarrow (R \rightarrow S))")]
    #[case(r"P4 \leftrightarrow (Q \leftrightarrow (R \leftrightarrow S))")]
    #[case(r"\forall xP(x)")]
    #[case(r"\forall x\forall y\forall zP(x,y,z)")]
    #[case(r"\exists xQ(x)")]
    #[case(r"\exists x\exists y\exists zQ(x,y,z)")]
    #[case(r"((P \land (Q \land R)) \rightarrow ((S \lor (T \lor U)) \rightarrow V)) \leftrightarrow W")]
    fn fml_display(s: &str) {
        assert_eq!(fml(s).to_string(), s);
    }

    #[case(r"P \vdash Q")]
    #[case(r"P, Q, R \vdash S, T, U")]
    #[case(r" \vdash ")]
    fn sequent_display(s: &str) {
        assert_eq!(seq(s).to_string(), s);
    }
}
