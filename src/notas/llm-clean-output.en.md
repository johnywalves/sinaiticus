---
title: "LLM Chat — Clean Markdown Output"
layout: base.njk
category: Snippets
tags: [llm, prompts, markdown]
---

By default, some assistants insert **numeric references** (like `[1]`, `[2]`) in
the body text to cite sources. In Markdown files that clutters the reading — the
page's "mechanics" should be invisible so the reader stays in the flow. You can
override this behavior per file with explicit instructions.

## Prompts for clean text

```text
Generate the Markdown content without including the numeric references in brackets.
```

```text
Keep the file text clean, with no source citations in the body of the document.
```

## Protecting nested code blocks

When asking for a Markdown file that contains code blocks, ask to **wrap the
whole Markdown in four backticks** — that way the inner blocks (three backticks)
don't break rendering:

```text
Wrap the entire Markdown in four backticks to protect the inner code blocks.
```

⚠️ The "no references" instruction applies only to the **file content**; in a
normal chat reply, citations are still useful for accuracy and transparency.
