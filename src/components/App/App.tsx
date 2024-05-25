import { QueryClient, QueryClientProvider } from 'react-query'

import { Box, Button } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'

import FilterModal from '../../components/FilterModal/FilterModal'
import { useFilterStore } from '../../store/filterStore/filterStore'

export const App = () => {
	const queryClient = new QueryClient()

	const { isOpen, onOpen, onClose } = useDisclosure()
	const { filters } = useFilterStore()

	return (
		<QueryClientProvider client={queryClient}>
			<Box
				maxW="90rem"
				mx="auto"
				minH="100dvh"
			>
				<Button onClick={onOpen}>Open Modal</Button>

				<FilterModal
					isOpen={isOpen}
					onClose={onClose}
				/>
				<Box mt={4}>
					<pre>{JSON.stringify(filters, null, 2)}</pre>
				</Box>
			</Box>
		</QueryClientProvider>
	)
}

export default App
