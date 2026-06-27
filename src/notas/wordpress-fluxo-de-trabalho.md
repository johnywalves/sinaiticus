---
title: "Trabalhar com WordPress (modelo mental do desenvolvedor)"
layout: base.njk
category: Backend
tags: [wordpress, php, cms, backend]
---

Resumo de campo para quem desenvolve **em cima** do WordPress (não só edita posts).
A chave para não brigar com o core é entender que tudo gira em torno de **hooks**:
você nunca altera o WordPress, você **se pendura** nos pontos de extensão dele.

## O modelo mental: hooks (actions e filters)

O WordPress dispara centenas de "eventos" durante o carregamento de uma página. Você
registra funções nesses eventos em vez de tocar no core — assim atualizações não
sobrescrevem seu código.

- **Action** — "aconteceu algo, _faça_ algo". Não retorna nada (efeito colateral).
- **Filter** — "vou usar esse valor, _transforme_ antes". Recebe e **retorna** o valor.
- ⚠️ Esquecer de `return $value` num filter é o bug nº 1: a tela fica em branco ou o
  conteúdo some.

```php
// Action: roda quando o WP termina de inicializar.
add_action('init', function () {
    register_post_type('livro', [/* ... */]);
});

// Filter: transforma o conteúdo antes de exibir (note o return).
add_filter('the_content', function ($content) {
    return $content . '<p>Obrigado por ler!</p>';
});
```

É o mesmo padrão de pipeline de extensão da [[express-middleware-chain|cadeia de
middlewares]]: pontos nomeados onde você injeta comportamento, sem editar o núcleo.

## Onde colocar seu código: plugin, não tema

Regra prática de separação de responsabilidades:

- **Tema** → _aparência_ (templates, CSS, layout). Use sempre um **child theme** para
  não perder customizações quando o tema pai atualizar.
- **Plugin** → _funcionalidade_ (custom post types, integrações, lógica de negócio).
  Sobrevive à troca de tema. É onde mora a maior parte do código de verdade.
- ⚠️ Nunca edite arquivos do core (`wp-admin`, `wp-includes`) nem do tema pai —
  qualquer `update` apaga tudo.

```php
<?php
/**
 * Plugin Name: Minha Funcionalidade
 */
// Um único arquivo em wp-content/plugins/minha-func/minha-func.php já é um plugin.
defined('ABSPATH') || exit; // bloqueia acesso direto ao arquivo.
```

## Dados: Custom Post Types e meta

Conteúdo estruturado além de "post" e "página" vira um **Custom Post Type** (CPT).
Campos extras (preço, ISBN, autor) são **post meta** — pares chave/valor anexados.

```php
register_post_type('livro', [
    'public'       => true,
    'show_in_rest' => true,           // habilita Gutenberg + REST API.
    'supports'     => ['title', 'editor', 'thumbnail'],
]);

update_post_meta($post_id, 'isbn', '978-85-..'); // grava metadado.
$isbn = get_post_meta($post_id, 'isbn', true);    // lê (true = valor único).
```

## Frente headless / integração: REST API

Todo CPT com `show_in_rest => true` ganha endpoints automáticos em `/wp-json/`. É a
ponte para front-ends desacoplados (React, Next.js) e integrações externas.

```bash
# Lista os "livros" como JSON, sem nenhum código extra.
curl https://meusite.com/wp-json/wp/v2/livro
```

## Tabela de referência rápida

| Quero...                       | Uso                                    |
| :----------------------------- | :------------------------------------- |
| Reagir a um evento do WP       | `add_action()`                         |
| Transformar um valor           | `add_filter()` (e **retornar**)        |
| Novo tipo de conteúdo          | `register_post_type()`                 |
| Campo extra num conteúdo       | `get/update_post_meta()`               |
| Expor dados pra um front       | REST API (`show_in_rest`) + `/wp-json` |
| Customizar aparência sem risco | **child theme**                        |

## Armadilhas comuns

- **Escapar saída sempre:** `esc_html()`, `esc_attr()`, `esc_url()` ao imprimir dados.
- **Sanitizar entrada:** `sanitize_text_field()` antes de gravar. (XSS/SQLi moram aqui.)
- **Use `$wpdb->prepare()`** para queries cruas — nunca concatene SQL.
- **Nonces** (`wp_nonce_field` / `check_admin_referer`) em todo formulário/ação que muda estado (CSRF).

## Referências e ferramentas

- **WP-CLI** — automatiza tudo pelo terminal (`wp plugin install`, `wp db export`).
- **Query Monitor** — plugin de debug: vê hooks, queries lentas e erros PHP.
- **Composer** — gerencia dependências PHP em plugins/temas modernos.

---

Relacionadas: [[express-middleware-chain|cadeia de middlewares]] ·
[[python-decorators|decorators em Python]] · [[git-commands|comandos Git]].
