import { useState } from 'react'

type CollapsibleSectionProps = {
    title: string
    defaultOpen?: boolean
    children: React.ReactNode
}

function CollapsibleSection({
    title,
    defaultOpen = false,
    children
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <section className="collapsible-section">
            <button
                className="collapsible-header"
                onClick={() => setIsOpen(prev => !prev)}
            >
                <span>{title}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="collapsible-content">
                    {children}
                </div>
            )}
        </section>
    )
}

export default CollapsibleSection
