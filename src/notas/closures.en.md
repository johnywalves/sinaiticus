---
title: Closures
layout: base.njk
category: Snippets
tags: [python, conceitos]
---

A **closure** happens when an inner function captures variables from the scope
where it was defined, even after that scope has finished executing.

```python
def multiplicador(fator):
    def multiplica(n):
        return n * fator   # 'fator' is captured by the closure
    return multiplica

dobro = multiplicador(2)
dobro(10)  # -> 20
```

They are the foundation of mechanisms like [[python-decorators|decorators]].
