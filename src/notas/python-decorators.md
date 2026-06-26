---
title: Decorators em Python
layout: base.njk
category: Snippets
tags: [python]
---

Um **decorator** é uma função que recebe outra função e estende seu
comportamento sem modificá-la diretamente. Eles dependem de [[closures]]
para guardar a referência da função original.

```python
import functools

def log(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"chamando {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log
def soma(a, b):
    return a + b
```

`functools.wraps` preserva o nome e a docstring da função decorada.

Veja também: [[closures]].
