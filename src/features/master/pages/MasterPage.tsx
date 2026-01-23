import { useState } from 'react'
import MasterNavbar from '../components/MasterNavbar'
import MasterMonsterList from '../components/MasterMonsterList'
import MasterMonsterSheet from '../components/MasterMonsterSheet'
import MasterMonsterWizard from '../components/MasterMonsterWizard'
import MasterElementTools from '../components/MasterElementTools'
import ElementDamageCalculator from '../components/ElementDamageCalculator'
import DiscoverElementRelations from '../components/DiscoverElementRelations'
import DiscoverElementAttackRelations from '../components/DiscoverElementAttackRelations'
import '../master.css'

type ActiveSection = 'monsters' | 'elements' | null
type ElementTool = 'damage' | 'weakness' | 'attack' | null

function MasterPage() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState<ActiveSection>(null)
  const [activeElementTool, setActiveElementTool] = useState<ElementTool>(null)

  const [selectedMonsterId, setSelectedMonsterId] = useState<number | null>(null)
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
          setActiveElementTool(null)
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

      {/* ============== CONTEÚDO CENTRAL ============== */}

      <main className="master-content">
        {!activeSection && (
          <div className="master-placeholder">
            Selecione uma opção no menu do mestre
          </div>
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
