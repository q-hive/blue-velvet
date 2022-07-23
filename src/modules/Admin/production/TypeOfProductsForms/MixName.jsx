export const MixName = () => {
    const [stepBtnLabel, setStepBtnLabel] = useState("Done")
    const [showTimes, setShowTimes] = useState(false)

    const handleSave = () => {
        
    }
  return (
    <div>
        
            
            
                <TextField type="number" label="Dark time" />
                <TextField type="number" label="Light time" />
            
            
            
                <TextField label="Product name"/>
                <TextField label="Product label"/>
                <TextField label="Seeding"/>
                <TextField label="Harvest"/>
                <TextField label="Price"/>
                <TextField label="Email / route"/>
                <TextField label="SeedID"/>
            

        
        <Button variant="contained" onClick={handleComplete}>{stepBtnLabel}</Button>
    </div>
  )
}
