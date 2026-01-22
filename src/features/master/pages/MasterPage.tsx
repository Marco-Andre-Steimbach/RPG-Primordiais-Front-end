import { useState } from 'react'
import MasterNavbar from '../components/MasterNavbar'
import MasterMonsterList from '../components/MasterMonsterList'
import MasterMonsterSheet from '../components/MasterMonsterSheet'
import MasterMonsterWizard from '../components/MasterMonsterWizard'
import '../master.css'

type ActiveSection = 'monsters' | null

function MasterPage() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState<ActiveSection>(null)

  const [selectedMonsterId, setSelectedMonsterId] = useState<number | null>(null)
  const [mode, setMode] = useState<'sheet' | 'create'>('sheet')

  return (
    <div className={`master-layout ${collapsed ? 'collapsed' : ''}`}>
      <MasterNavbar
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        onSelect={setActiveSection}
      />

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

      <main className="master-content">
        {activeSection !== 'monsters' && (
          <div className="master-placeholder">Selecione uma opção no menu do mestre</div>
        )}

        {activeSection === 'monsters' && mode === 'sheet' && selectedMonsterId && (
          <MasterMonsterSheet monsterId={selectedMonsterId} />
        )}

        {activeSection === 'monsters' && mode === 'sheet' && !selectedMonsterId && (
          <div className="master-placeholder">Selecione um monstro na lista</div>
        )}

        {activeSection === 'monsters' && mode === 'create' && (
          <MasterMonsterWizard onCancel={() => setMode('sheet')} onDone={(id) => {
            setSelectedMonsterId(id)
            setMode('sheet')
          }} />
        )}
      </main>
    </div>
  )
}

export default MasterPage
