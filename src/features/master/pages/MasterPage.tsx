import { useState } from 'react'
import MasterNavbar from '../components/MasterNavbar'
import MasterMonsterList from '../components/MasterMonsterList'
import MasterMonsterSheet from '../components/MasterMonsterSheet'
import MasterMonsterWizard from '../components/MasterMonsterWizard'
import MasterElementTools from '../components/MasterElementTools'
import ElementDamageCalculator from '../components/ElementDamageCalculator'
import DiscoverElementRelations from '../components/DiscoverElementRelations'
import DiscoverElementAttackRelations from '../components/DiscoverElementAttackRelations'
import MasterCharacterTools from '../components/MasterCharacterTools'
import MasterGiveGold from '../components/MasterGiveGold'
import MasterGiveXP from '../components/MasterGiveXP'
import MasterGiveItem from '../components/MasterGiveItem'
import MasterGiveWeapon from '../components/MasterGiveWeapon'
import MasterGiveArmor from '../components/MasterGiveArmor'
import MasterItemTools from '../components/MasterItemTools'
import MasterItemWizard from '../components/MasterItemWizard'
import MasterWeaponWizard from '../components/MasterWeaponWizard'
import MasterArmorWizard from '../components/MasterArmorWizard'
import MasterEncounterTools from '../components/MasterEncounterTools'
import MasterEncounterList from '../components/MasterEncounterList'
import MasterEncounterWizard from '../components/MasterEncounterWizard'
import MasterEncounterSheet from '../components/MasterEncounterSheet'
import MasterEncounterParticipantsWizard from '../components/MasterEncounterParticipantsWizard'
import MasterEncounterCombatSetup from '../components/MasterEncounterCombatSetup'
import MasterEncounterCombat from '../components/MasterEncounterCombat'

import '../master.css'

type ActiveSection = 'monsters' | 'elements' | 'characters' | 'items' | 'encounters' | null
type EncounterTool = 'search' | 'create' | null
type ElementTool = 'damage' | 'weakness' | 'attack' | null
type CharacterTool = 'sheet' | 'gold' | 'xp' | 'item' | 'weapon' | 'armor' | null
type ItemTool = 'item' | 'weapon' | 'armor' | null
type EncounterMode =
    | 'sheet'
    | 'participants'
    | 'combatSetup'
    | 'combat'

function MasterPage() {
    const [collapsed, setCollapsed] = useState(false)
    const [activeSection, setActiveSection] = useState<ActiveSection>(null)

    const [activeElementTool, setActiveElementTool] =
        useState<ElementTool>(null)

    const [encounterMode, setEncounterMode] =
        useState<EncounterMode>('sheet')

    const [activeCharacterTool, setActiveCharacterTool] =
        useState<CharacterTool>(null)

    const [selectedMonsterId, setSelectedMonsterId] =
        useState<number | null>(null)

    const [activeItemTool, setActiveItemTool] =
        useState<ItemTool>(null)

    const [activeEncounterTool, setActiveEncounterTool] =
        useState<EncounterTool>(null)

    const [selectedEncounterId, setSelectedEncounterId] =
        useState<number | null>(null)


    const [mode, setMode] = useState<'sheet' | 'create'>('sheet')

    return (
        <div className={`master-layout ${collapsed ? 'collapsed' : ''}`}>
            <MasterNavbar
                collapsed={collapsed}
                onToggle={() => setCollapsed(v => !v)}
                onSelect={(section) => {
                    setActiveSection(section)
                    setMode('sheet')
                    setSelectedMonsterId(null)
                    setSelectedEncounterId(null)
                    setActiveElementTool(null)
                    setActiveCharacterTool(null)
                    setActiveItemTool(null)
                    setActiveEncounterTool(null)
                    setEncounterMode('sheet')
                }}
            />

            {/* ============== SIDE PANELS ============== */}

            {activeSection === 'monsters' && (
                <MasterMonsterList
                    onCreate={() => {
                        setMode('create')
                        setSelectedMonsterId(null)
                    }}
                    selectedMonsterId={selectedMonsterId}
                    onSelectMonster={(id) => {
                        setSelectedMonsterId(id)
                        setMode('sheet')
                    }}
                />
            )}

            {activeSection === 'elements' && (
                <MasterElementTools
                    activeTool={activeElementTool}
                    onSelectTool={setActiveElementTool}
                />
            )}

            {activeSection === 'characters' && (
                <MasterCharacterTools
                    activeTool={activeCharacterTool}
                    onSelectTool={setActiveCharacterTool}
                />
            )}

            {activeSection === 'items' && (
                <MasterItemTools
                    activeTool={activeItemTool}
                    onSelectTool={setActiveItemTool}
                />
            )}

            {activeSection === 'encounters' && activeEncounterTool !== 'search' && (
                <MasterEncounterTools
                    activeTool={activeEncounterTool}
                    onSelectTool={(tool) => {
                        setActiveEncounterTool(tool)
                        setSelectedEncounterId(null)
                    }}
                />
            )}

            {activeSection === 'encounters' && activeEncounterTool === 'search' && (
                <MasterEncounterList
                    selectedEncounterId={selectedEncounterId}
                    onSelectEncounter={(id) => {
                        setSelectedEncounterId(id)
                        setEncounterMode('sheet')
                    }}
                />
            )}


            {/* ============== CONTEÚDO CENTRAL ============== */}

            <main className="master-content">
                {!activeSection && (
                    <div className="master-placeholder">
                        Selecione uma opção no menu do mestre
                    </div>
                )}

                {/* ================= PERSONAGENS ================= */}

                {activeSection === 'characters' && !activeCharacterTool && (
                    <div className="master-placeholder">
                        Selecione uma ação para personagens
                    </div>
                )}

                {activeSection === 'characters' && activeCharacterTool === 'gold' && (
                    <MasterGiveGold />
                )}

                {activeSection === 'characters' && activeCharacterTool === 'xp' && (
                    <MasterGiveXP />
                )}

                {activeSection === 'characters' && activeCharacterTool === 'item' && (
                    <MasterGiveItem />
                )}

                {activeSection === 'characters' && activeCharacterTool === 'weapon' && (
                    <MasterGiveWeapon />
                )}

                {activeSection === 'characters' && activeCharacterTool === 'armor' && (
                    <MasterGiveArmor />
                )}

                {/* ================= MONSTROS ================= */}

                {activeSection === 'monsters' && mode === 'sheet' && selectedMonsterId && (
                    <MasterMonsterSheet monsterId={selectedMonsterId} />
                )}

                {activeSection === 'monsters' && mode === 'sheet' && !selectedMonsterId && (
                    <div className="master-placeholder">
                        Selecione um monstro na lista
                    </div>
                )}

                {activeSection === 'monsters' && mode === 'create' && (
                    <MasterMonsterWizard
                        onCancel={() => setMode('sheet')}
                        onDone={(id) => {
                            setSelectedMonsterId(id)
                            setMode('sheet')
                        }}
                    />
                )}

                {/* ================= ELEMENTOS ================= */}

                {activeSection === 'elements' && !activeElementTool && (
                    <div className="master-placeholder">
                        Selecione uma ferramenta de elementos
                    </div>
                )}

                {activeSection === 'elements' && activeElementTool === 'damage' && (
                    <ElementDamageCalculator />
                )}

                {activeSection === 'elements' && activeElementTool === 'weakness' && (
                    <DiscoverElementRelations />
                )}

                {activeSection === 'elements' && activeElementTool === 'attack' && (
                    <DiscoverElementAttackRelations />
                )}

                {/* ================= ITEMS ================= */}

                {activeSection === 'items' && !activeItemTool && (
                    <div className="master-placeholder">
                        Selecione uma ação de itens
                    </div>
                )}

                {activeSection === 'items' && activeItemTool === 'item' && (
                    <MasterItemWizard
                        onCancel={() => setActiveItemTool(null)}
                        onDone={() => setActiveItemTool(null)}
                    />
                )}

                {activeSection === 'items' && activeItemTool === 'weapon' && (
                    <MasterWeaponWizard
                        onCancel={() => setActiveItemTool(null)}
                    />
                )}

                {activeSection === 'items' && activeItemTool === 'armor' && (
                    <MasterArmorWizard
                        onCancel={() => setActiveItemTool(null)}
                    />
                )}

                {/* ================= ENCOUNTERS ================= */}

                {activeSection === 'encounters' && !activeEncounterTool && (
                    <div className="master-placeholder">
                        Selecione uma ação para encontros
                    </div>
                )}

                {activeSection === 'encounters' &&
                    activeEncounterTool === 'search' &&
                    !selectedEncounterId && (
                        <div className="master-placeholder">
                            Selecione um encontro na lista
                        </div>
                    )}

                {activeSection === 'encounters' &&
                    activeEncounterTool === 'search' &&
                    selectedEncounterId &&
                    encounterMode === 'sheet' && (
                        <MasterEncounterSheet
                            encounterId={selectedEncounterId}
                            onAddParticipants={() =>
                                setEncounterMode('participants')
                            }
                            onStartCombat={() =>
                                setEncounterMode('combatSetup')
                            }
                            onOpenCombat={() =>
                                setEncounterMode('combat')
                            }
                        />
                    )}
                {encounterMode === 'combatSetup' && selectedEncounterId && (
                    <MasterEncounterCombatSetup
                        encounterId={selectedEncounterId}
                        onBack={() => setEncounterMode('sheet')}
                        onCombatStarted={() => setEncounterMode('combat')}
                    />
                )}



                {activeSection === 'encounters' &&
                    activeEncounterTool === 'search' &&
                    selectedEncounterId &&
                    encounterMode === 'participants' && (
                        <MasterEncounterParticipantsWizard
                            encounterId={selectedEncounterId}
                            onCancel={() => setEncounterMode('sheet')}
                            onDone={() => setEncounterMode('sheet')}
                        />
                    )}

                {activeSection === 'encounters' &&
                    activeEncounterTool === 'search' &&
                    selectedEncounterId &&
                    encounterMode === 'combat' && (
                        <MasterEncounterCombat
                            encounterId={selectedEncounterId}
                            onBack={() => setEncounterMode('sheet')}
                        />
                    )}

                {activeSection === 'encounters' &&
                    activeEncounterTool === 'create' && (
                        <MasterEncounterWizard
                            onCancel={() => setActiveEncounterTool(null)}
                            onDone={(id) => {
                                setSelectedEncounterId(id)
                                setActiveEncounterTool('search')
                            }}
                        />
                    )}

            </main>
        </div>
    )
}

export default MasterPage
