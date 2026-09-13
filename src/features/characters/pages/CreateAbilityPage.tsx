import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchCharacterById,
  createCharacterAbility,
  fetchElements
} from '../characters.service'
import type {
  CharacterFull,
  ElementType
} from '../characters.types'
import '../characters.css'

const ABILITY_CREATION_PROMPT = `
Você vai receber abaixo uma ideia de habilidade para um sistema de RPG.

A ideia pode estar extremamente detalhada ou pode ser apenas uma frase simples. Sua tarefa é REESCREVER, ORGANIZAR E COMPLETAR essa ideia para que ela fique clara, consistente e pronta para ser cadastrada no sistema.

NÃO converse comigo.
NÃO explique o que você alterou.
NÃO faça perguntas.
NÃO dê opinião sobre a habilidade.
NÃO responda fora do formato solicitado.
Retorne somente a habilidade reescrita.

REGRAS IMPORTANTES

1. Preserve completamente a identidade da habilidade.
Mantenha nomes, personagens, piadas, humor, lore, referências e intenção original do jogador.

2. Se o jogador já escreveu uma habilidade detalhada:
- Não remova efeitos.
- Não remova números.
- Não simplifique mecânicas importantes.
- Não altere fórmulas sem necessidade.
- Apenas organize, esclareça e corrija ambiguidades.

3. Se o jogador escreveu algo muito simples, como:
"Herectus pula alto e cai causando dano"
expanda a ideia para uma habilidade completa e coerente, sem transformar o conceito em algo completamente diferente.

4. Caso faltem valores essenciais, você pode sugerir valores simples e coerentes para:
- dano;
- cura;
- duração;
- alcance;
- área;
- bônus;
- penalidades;
- mana.

Evite criar mecânicas excessivamente complexas quando a ideia original for simples.

5. Sempre deixe claro, quando aplicável:
- quem é o alvo;
- quantidade de alvos;
- alcance;
- área;
- duração;
- frequência do efeito;
- dano ou cura;
- bônus ou penalidade;
- condições;
- empilhamento;
- funcionamento de invocações, totens ou criaturas.

6. Fórmulas devem permanecer legíveis, por exemplo:
4d12
2d8+4
lvl
lvl/4
4d20+lvl

7. Alcance em casas deve ser escrito usando "c".
Exemplo:
15c

8. Caso a habilidade utilize teste, organize seus resultados obrigatoriamente em:
Crítico
Acerto
Falha
Falha Crítica

Se a habilidade claramente não utilizar teste, escreva:
"Teste: Não se aplica — efeito automático."
e não invente Crítico, Acerto, Falha e Falha Crítica sem necessidade.

9. A Queima Arcana pode alterar completamente o funcionamento da habilidade normal.
Não force a versão arcana a ser apenas uma versão numericamente maior.

10. Os elementos permitidos são somente:
Normal, Fogo, Água, Grama, Elétrico, Terra, Pedra, Gelo, Voador, Lutador, Veneno, Inseto, Ferro, Psíquico, Fantasma, Sombrio, Fada, Dragão, Divino, Demônio, Luz, Arcano, Construto, Máquina, Morto-Vivo, Tempo, Espaço, Som e Sangue.

Se o jogador não informar os elementos, escolha apenas os que realmente combinam com a habilidade.
Não escolha uma quantidade fixa de elementos.

11. A habilidade normal e a Queima Arcana podem possuir elementos diferentes.

12. Se o jogador não fornecer uma Queima Arcana, não invente uma completamente do nada.
Nesse caso escreva "Não informada" nos campos arcanos.

13. Não use tabelas.
Não coloque observações antes ou depois.
Não use frases como "Aqui está sua habilidade".
Entregue somente o conteúdo abaixo.

FORMATO OBRIGATÓRIO:

HABILIDADE NORMAL

Título:
[nome]

Descrição:
[descrição narrativa da habilidade]

Mecânica:
[funcionamento objetivo e completo]

Teste:
[tipo de teste ou "Não se aplica — efeito automático"]

Crítico:
[resultado ou "Não se aplica"]

Acerto:
[resultado ou "Não se aplica"]

Falha:
[resultado ou "Não se aplica"]

Falha Crítica:
[resultado ou "Não se aplica"]

Mana sugerida:
[valor]

Alcance:
[valor em casas ou descrição]

Elementos:
[elementos separados por vírgula]


QUEIMA ARCANA

Título:
[nome ou "Não informada"]

Descrição:
[descrição narrativa ou "Não informada"]

Mecânica:
[funcionamento objetivo ou "Não informada"]

Teste:
[tipo de teste, "Não se aplica — efeito automático" ou "Não informada"]

Crítico:
[resultado]

Acerto:
[resultado]

Falha:
[resultado]

Falha Crítica:
[resultado]

Mana sugerida:
[valor ou "Não informada"]

Alcance:
[valor ou "Não informada"]

Elementos:
[elementos ou "Não informada"]


Agora processe exclusivamente a ideia de habilidade escrita abaixo:
`.trim()

function CreateAbilityPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [character, setCharacter] =
    useState<CharacterFull | null>(null)

  const [elements, setElements] =
    useState<ElementType[]>([])

  const [submitting, setSubmitting] =
    useState(false)

  const [promptCopied, setPromptCopied] =
    useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',

    arcane_title: '',
    arcane_description: '',

    mana_cost: '',
    arcane_mana_cost: '',

    normal_element_types: [] as number[],
    arcane_element_types: [] as number[]
  })

  useEffect(() => {
    if (!id) {
      return
    }

    fetchCharacterById(
      Number(id)
    ).then(response => {
      setCharacter(
        response.character
      )
    })

    fetchElements().then(response => {
      setElements(
        response.elements
      )
    })
  }, [id])

  function handleChange(
    event:
      React.ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement
      >
  ) {
    const {
      name,
      value
    } = event.target

    setForm(previous => ({
      ...previous,
      [name]: value
    }))
  }

  function toggleNormalElement(
    elementId: number
  ) {
    setForm(previous => ({
      ...previous,

      normal_element_types:
        previous
          .normal_element_types
          .includes(elementId)
          ? previous
              .normal_element_types
              .filter(
                id => id !== elementId
              )
          : [
              ...previous
                .normal_element_types,
              elementId
            ]
    }))
  }

  function toggleArcaneElement(
    elementId: number
  ) {
    setForm(previous => ({
      ...previous,

      arcane_element_types:
        previous
          .arcane_element_types
          .includes(elementId)
          ? previous
              .arcane_element_types
              .filter(
                id => id !== elementId
              )
          : [
              ...previous
                .arcane_element_types,
              elementId
            ]
    }))
  }

  async function handleCopyPrompt() {
    await navigator.clipboard.writeText(
      ABILITY_CREATION_PROMPT
    )

    setPromptCopied(true)

    window.setTimeout(() => {
      setPromptCopied(false)
    }, 2000)
  }

  async function handleSubmit() {
    if (
      !id ||
      !character ||
      submitting
    ) {
      return
    }

    const payload = {
      title:
        form.title.trim(),

      description:
        form.description.trim(),

      arcane_title:
        form.arcane_title.trim() !== ''
          ? form.arcane_title.trim()
          : null,

      arcane_description:
        form.arcane_description.trim() !== ''
          ? form.arcane_description.trim()
          : null,

      mana_cost:
        Number(
          form.mana_cost || 0
        ),

      arcane_mana_cost:
        form.arcane_mana_cost !== ''
          ? Number(
              form.arcane_mana_cost
            )
          : null,

      normal_element_types:
        form.normal_element_types,

      arcane_element_types:
        form.arcane_element_types,

      required_race_id:
        character.character.race_id,

      required_order_id:
        character.character.order_id
    }

    try {
      setSubmitting(true)

      await createCharacterAbility(
        Number(id),
        payload
      )

      navigate(-1)
    } finally {
      setSubmitting(false)
    }
  }

  if (!character) {
    return (
      <div className="ability-create-page">
        <div className="ability-create-loading">
          Carregando...
        </div>
      </div>
    )
  }

  return (
    <div className="ability-create-page">
      <div className="ability-create-wrapper">
        <header className="ability-create-header">
          <div>
            <button
              type="button"
              className="ability-create-back"
              onClick={() =>
                navigate(-1)
              }
            >
              ← Voltar
            </button>

            <h1>
              Criar habilidade
            </h1>

            <p>
              {character.character.name}
            </p>
          </div>
        </header>

        <section className="ability-create-ai-helper">
          <div className="ability-create-ai-helper-content">
            <span className="ability-create-ai-helper-kicker">
              Ajuda para criação
            </span>

            <h2>
              Organize sua ideia com IA
            </h2>

            <p>
              Copie o prompt, cole no ChatGPT e escreva
              sua ideia logo abaixo. Pode ser uma habilidade
              completa ou apenas uma frase simples.
            </p>

            <span className="ability-create-ai-helper-example">
              Exemplo: "Herectus pula alto e cai causando dano"
            </span>
          </div>

          <button
            type="button"
            className={
              `ability-create-ai-copy ${
                promptCopied
                  ? 'is-copied'
                  : ''
              }`
            }
            onClick={
              handleCopyPrompt
            }
          >
            {promptCopied
              ? 'Prompt copiado!'
              : 'Copiar prompt para IA'}
          </button>
        </section>

        <div className="ability-create-grid">
          <section className="ability-create-card">
            <div className="ability-create-card-header">
              <div>
                <span className="ability-create-eyebrow">
                  Forma normal
                </span>

                <h2>
                  Habilidade
                </h2>
              </div>
            </div>

            <div className="ability-create-fields">
              <label className="ability-create-field">
                <span>
                  Título
                </span>

                <input
                  name="title"
                  placeholder="Nome da habilidade"
                  value={form.title}
                  onChange={handleChange}
                />
              </label>

              <label className="ability-create-field">
                <span>
                  Descrição
                </span>

                <textarea
                  name="description"
                  placeholder="Cole aqui a habilidade organizada ou escreva livremente como ela funciona..."
                  value={form.description}
                  onChange={handleChange}
                />
              </label>

              <label className="ability-create-field ability-create-mana">
                <span>
                  Mana sugerida
                </span>

                <input
                  type="number"
                  min="0"
                  name="mana_cost"
                  placeholder="0"
                  value={form.mana_cost}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="ability-create-elements">
              <div className="ability-create-elements-header">
                <strong>
                  Elementos
                </strong>

                <span>
                  {
                    form
                      .normal_element_types
                      .length
                  } selecionado(s)
                </span>
              </div>

              <div className="ability-create-elements-grid">
                {elements.map(
                  element => {
                    const active =
                      form
                        .normal_element_types
                        .includes(
                          element.id
                        )

                    return (
                      <button
                        key={
                          element.id
                        }
                        type="button"
                        className={
                          `ability-create-element ${
                            active
                              ? 'is-active'
                              : ''
                          }`
                        }
                        onClick={() =>
                          toggleNormalElement(
                            element.id
                          )
                        }
                      >
                        {element.name}
                      </button>
                    )
                  }
                )}
              </div>
            </div>
          </section>

          <section className="ability-create-card ability-create-card-arcane">
            <div className="ability-create-card-header">
              <div>
                <span className="ability-create-eyebrow">
                  Forma alternativa
                </span>

                <h2>
                  Queima Arcana
                </h2>
              </div>
            </div>

            <div className="ability-create-fields">
              <label className="ability-create-field">
                <span>
                  Título Arcano
                </span>

                <input
                  name="arcane_title"
                  placeholder="Nome da Queima Arcana"
                  value={
                    form.arcane_title
                  }
                  onChange={
                    handleChange
                  }
                />
              </label>

              <label className="ability-create-field">
                <span>
                  Descrição Arcana
                </span>

                <textarea
                  name="arcane_description"
                  placeholder="Cole aqui a versão arcana organizada ou descreva como ela altera a habilidade original..."
                  value={
                    form.arcane_description
                  }
                  onChange={
                    handleChange
                  }
                />
              </label>

              <label className="ability-create-field ability-create-mana">
                <span>
                  Mana Arcana sugerida
                </span>

                <input
                  type="number"
                  min="0"
                  name="arcane_mana_cost"
                  placeholder="0"
                  value={
                    form.arcane_mana_cost
                  }
                  onChange={
                    handleChange
                  }
                />
              </label>
            </div>

            <div className="ability-create-elements">
              <div className="ability-create-elements-header">
                <strong>
                  Elementos
                </strong>

                <span>
                  {
                    form
                      .arcane_element_types
                      .length
                  } selecionado(s)
                </span>
              </div>

              <div className="ability-create-elements-grid">
                {elements.map(
                  element => {
                    const active =
                      form
                        .arcane_element_types
                        .includes(
                          element.id
                        )

                    return (
                      <button
                        key={
                          element.id
                        }
                        type="button"
                        className={
                          `ability-create-element ${
                            active
                              ? 'is-active'
                              : ''
                          }`
                        }
                        onClick={() =>
                          toggleArcaneElement(
                            element.id
                          )
                        }
                      >
                        {element.name}
                      </button>
                    )
                  }
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="ability-create-actions">
          <button
            type="button"
            className="ability-create-cancel"
            onClick={() =>
              navigate(-1)
            }
          >
            Cancelar
          </button>

          <button
            type="button"
            className="ability-create-submit"
            disabled={submitting}
            onClick={
              handleSubmit
            }
          >
            {submitting
              ? 'Criando...'
              : 'Criar habilidade'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateAbilityPage
