# Consult Debbie and Sheldon

Consult both read-only advisors on the same payload. Debbie judges whether the proposed work is worth doing and whether its scope is justified. Sheldon judges whether its claims are true and whether the engineering is sound. Keep both answers independent.

## Reach both advisors

Use the current client's native custom-agent mechanism to start Debbie and Sheldon concurrently. In clients that preserve subagent sessions, reuse the same two instances for later consults so they retain prior rulings. Run the consult synchronously and do not proceed past the decision while it is pending.

## Payload

Send both advisors the identical three sections in this order:

1. `User typed this, verbatim:` followed by the user's exact words in a four-backtick fence. When the calling agent initiated the consult, label it `The calling agent is asking:` instead.
2. `Sources — read these yourself:` followed by file paths, issue or pull-request numbers, commits, or document sections. Name sources without summarizing them.
3. `Calling agent's account — not the user's words:` with at most six lines containing only facts unavailable in readable sources, such as what was tried and what was rejected.

Do not put the caller's preferred outcome or confidence into the payload. If a required source cannot be read, say so rather than substituting a summary.

## Relay

Return Debbie's complete block followed by Sheldon's complete block, unaltered. Add nothing unless a factual correction or genuine disagreement is necessary; keep that addition to two sentences. Their findings are advice and authorize no edit, issue, comment, or repository mutation. Follow the current project's rules if it requires advisor findings to be recorded elsewhere.
