import { useState } from 'react'

type AttackResult = {
    attack: number
    rolls: number[]
    diceTotal: number
    modifier: number
    total: number
}

type Props = {
    isOpen: boolean
    onClose: () => void
}

function rollDie(sides: number): number {
    const values = new Uint32Array(1)
    crypto.getRandomValues(values)

    return (values[0] % sides) + 1
}

function DiceRollerDrawer({
    isOpen,
    onClose
}: Props) {
    const [diceAmount, setDiceAmount] = useState(1)
    const [diceSides, setDiceSides] = useState(20)
    const [modifier, setModifier] = useState(0)

    const [multipleAttacks, setMultipleAttacks] = useState(false)
    const [attackAmount, setAttackAmount] = useState(2)

    const [results, setResults] = useState<AttackResult[]>([])

    function handleRoll() {
        const safeDiceAmount = Math.max(1, diceAmount)
        const safeDiceSides = Math.max(2, diceSides)

        const totalAttacks = multipleAttacks
            ? Math.max(1, attackAmount)
            : 1

        const generatedResults = Array.from(
            { length: totalAttacks },
            (_, attackIndex) => {
                const rolls = Array.from(
                    { length: safeDiceAmount },
                    () => rollDie(safeDiceSides)
                )

                const diceTotal = rolls.reduce(
                    (total, value) => total + value,
                    0
                )

                return {
                    attack: attackIndex + 1,
                    rolls,
                    diceTotal,
                    modifier,
                    total: diceTotal + modifier
                }
            }
        )

        setResults(generatedResults)
    }

    function handleClear() {
        setResults([])
    }

    const grandTotal = results.reduce(
        (total, result) => total + result.total,
        0
    )

    if (!isOpen) return null

    return (
        <>
            <div
                className="dice-drawer-backdrop"
                onClick={onClose}
            />

            <aside className="dice-drawer">
                <div className="dice-drawer-header">
                    <div>
                        <h2>Rolador de Dados</h2>
                        <span>Calcule ataques e danos múltiplos</span>
                    </div>

                    <button
                        type="button"
                        className="dice-drawer-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="dice-formula">
                    <label>
                        <span>Dados</span>
                        <input
                            type="number"
                            min="1"
                            value={diceAmount}
                            onChange={event =>
                                setDiceAmount(
                                    Number(event.target.value)
                                )
                            }
                        />
                    </label>

                    <strong>d</strong>

                    <label>
                        <span>Faces</span>
                        <input
                            type="number"
                            min="2"
                            value={diceSides}
                            onChange={event =>
                                setDiceSides(
                                    Number(event.target.value)
                                )
                            }
                        />
                    </label>

                    <strong>+</strong>

                    <label>
                        <span>Bônus</span>
                        <input
                            type="number"
                            value={modifier}
                            onChange={event =>
                                setModifier(
                                    Number(event.target.value)
                                )
                            }
                        />
                    </label>
                </div>

                <div className="dice-formula-preview">
                    {diceAmount}d{diceSides}
                    {modifier >= 0 ? '+' : ''}
                    {modifier}
                </div>

                <label className="dice-multiple-option">
                    <input
                        type="checkbox"
                        checked={multipleAttacks}
                        onChange={event => {
                            setMultipleAttacks(
                                event.target.checked
                            )
                            setResults([])
                        }}
                    />

                    <span>Múltiplos ataques</span>
                </label>

                {multipleAttacks && (
                    <label className="dice-attacks-input">
                        <span>Quantidade de ataques</span>

                        <input
                            type="number"
                            min="1"
                            value={attackAmount}
                            onChange={event =>
                                setAttackAmount(
                                    Number(event.target.value)
                                )
                            }
                        />
                    </label>
                )}

                <div className="dice-drawer-actions">
                    <button
                        type="button"
                        className="dice-roll-button"
                        onClick={handleRoll}
                    >
                        Rolar dados
                    </button>

                    {results.length > 0 && (
                        <button
                            type="button"
                            className="dice-clear-button"
                            onClick={handleClear}
                        >
                            Limpar
                        </button>
                    )}
                </div>

                {results.length > 0 && (
                    <div className="dice-results">
                        <div className="dice-results-header">
                            <h3>Resultados</h3>

                            {results.length > 1 && (
                                <strong>
                                    Total: {grandTotal}
                                </strong>
                            )}
                        </div>

                        {results.map(result => (
                            <div
                                key={result.attack}
                                className="dice-result-card"
                            >
                                <div className="dice-result-title">
                                    <strong>
                                        {multipleAttacks
                                            ? `Ataque ${result.attack}`
                                            : 'Resultado'}
                                    </strong>

                                    <span>
                                        {result.total}
                                    </span>
                                </div>

                                <div className="dice-result-calculation">
                                    Dados: {result.diceTotal}

                                    {result.modifier !== 0 && (
                                        <>
                                            {' '}
                                            {result.modifier > 0
                                                ? '+'
                                                : '-'}{' '}
                                            {Math.abs(result.modifier)}
                                        </>
                                    )}
                                </div>

                                <details className="dice-roll-details">
                                    <summary>
                                        Ver {result.rolls.length} dado(s)
                                    </summary>

                                    <div className="dice-roll-values">
                                        {result.rolls.map(
                                            (value, index) => (
                                                <span key={index}>
                                                    {value}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </details>
                            </div>
                        ))}
                    </div>
                )}
            </aside>
        </>
    )
}

export default DiceRollerDrawer
