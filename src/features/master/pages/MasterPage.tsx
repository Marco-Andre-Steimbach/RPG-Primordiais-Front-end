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
import '../master.css'

type ActiveSection = 'monsters' | 'elements' | 'characters' | null
type ElementTool = 'damage' | 'weakness' | 'attack' | null
type CharacterTool = 'sheet' | 'gold' | 'xp' | 'item' | 'weapon' | 'armor' | null

function MasterPage() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState<ActiveSection>(null)

  const [activeElementTool, setActiveElementTool] =
    useState<ElementTool>(null)

  const [activeCharacterTool, setActiveCharacterTool] =
    useState<CharacterTool>(null)

  const [selectedMonsterId, setSelectedMonsterId] =
    useState<number | null>(null)

  const [selectedCharacterId, setSelectedCharacterId] =
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
          setSelectedCharacterId(null)
          setActiveElementTool(null)
          setActiveCharacterTool(null)
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
      </main>
    </div>
  )
}

export default MasterPage
