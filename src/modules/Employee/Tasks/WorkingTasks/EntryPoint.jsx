import React, { useEffect } from 'react'

export const EntryPoint = () => {
    const [productionLines, setProductionLines] = useState([])

    
    useEffect(() => {
        //*get production lines from org container.
    },[])
  return (
    <Box component="div" minHeight="100vh" display="flex"  >
            <Container maxWidth="md" >
                <Box display="flex" flexDirection="column" py={8} width="100%" height="100%" alignItems="center" >
                    <Paper sx={{width: {xs:"80%", md:450}, height: 450, m:3}}>
                        Tasks from orders: id, id, id, id
                    </Paper>


                    {/* TASKS FROM PRODUCTION LINES */}
                    {tasks.map((task, idx) => {
                        
                    })
                    }
                </Box>
            </Container>
       </Box>
  )
}
