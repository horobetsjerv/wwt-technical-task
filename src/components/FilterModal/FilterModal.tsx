import { useState } from 'react'
import { useQuery } from 'react-query'

import {
	Box,
	Button,
	Checkbox,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	VStack
} from '@chakra-ui/react'

import { FilterItem } from '../../api/types/Filter/FilterItem'
import { useFilterStore } from '../../store/filterStore/filterStore'
import './FilterModal.css'

const fetchFilterData = async (): Promise<{ filterItems: FilterItem[] }> => {
	const response = await fetch('src/temp/filterData.json')
	if (!response.ok) {
		throw new Error('Network response was not ok')
	}
	return response.json()
}

const FilterModal = ({
	isOpen,
	onClose
}: {
	isOpen: boolean
	onClose: () => void
}) => {
	const { data, isLoading } = useQuery<{ filterItems: FilterItem[] }>(
		'filterData',
		fetchFilterData
	)
	const { filters, setFilters, applyFilters, clearFilters } = useFilterStore()

	// Temporary filters state
	const [tempFilters, setTempFilters] = useState(filters)
	const [isConfirmationOpen, setConfirmationOpen] = useState(false)

	const handleCheckboxChange = (category: string, optionId: string) => {
		setTempFilters(prevFilters => {
			const categoryFilters = prevFilters[category] || []
			if (categoryFilters.includes(optionId)) {
				return {
					...prevFilters,
					[category]: categoryFilters.filter(id => id !== optionId)
				}
			} else {
				return {
					...prevFilters,
					[category]: [...categoryFilters, optionId]
				}
			}
		})
	}

	const handleApplyFilters = () => {
		Object.keys(tempFilters).forEach(category => {
			tempFilters[category].forEach(optionId => {
				setFilters(category, optionId)
			})
		})
		applyFilters()
		setConfirmationOpen(false)
		onClose()
	}

	if (isLoading) {
		return <Text>Loading...</Text>
	}

	const handleKeepOldFilters = () => {
		setTempFilters(filters) // Reset tempFilters to the current filters
		setConfirmationOpen(false)
		onClose()
	}

	const handleClearFilters = () => {
		clearFilters()
		setTempFilters({})
	}

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="full"
			>
				<ModalOverlay />
				<ModalContent>
					<div className="filter-modal-container">
						<div>
							<Text className="filter-modal-header_title">Filter</Text>
						</div>
						<ModalCloseButton size="lg" />
					</div>
					<div className="filter-modal-header_underline" />
					<ModalBody>
						{isLoading ? (
							<div></div>
						) : (
							<VStack align="start">
								{data?.filterItems.map((item: FilterItem) => (
									<Box
										key={item.id}
										mb={4}
									>
										<Text fontWeight="bold">{item.name}</Text>
										<div>
											<div className="filter-modal-filters-container">
												{item.options.map(option => (
													<Checkbox
														key={option.id}
														size="md"
														isChecked={tempFilters[item.id]?.includes(
															option.id
														)}
														onChange={() =>
															handleCheckboxChange(item.id, option.id)
														}
													>
														{option.name}
													</Checkbox>
												))}
											</div>
										</div>
										<div className="filter-modal_underline" />
									</Box>
								))}
							</VStack>
						)}
					</ModalBody>
					<div className="modal-filter-footer-container">
						<Button
							background={'#ff5f00'}
							colorScheme="orange"
							mr={3}
							onClick={() => {
								setConfirmationOpen(true)
							}}
						>
							Apply
						</Button>
						<Text
							className="clear-parameters"
							onClick={handleClearFilters}
						>
							Clear all parameters
						</Text>
					</div>
				</ModalContent>
			</Modal>

			<Modal
				isOpen={isConfirmationOpen}
				onClose={() => setConfirmationOpen(false)}
			>
				<ModalOverlay />
				<ModalContent
					width="90vw"
					height="30vh"
					maxHeight="30vh"
					maxWidth="100vw"
				>
					<div className="filter-modal-apply-header_container">
						<Text className="filter-modal-apply-header_title">
							Do you want to apply new filter
						</Text>
						<ModalCloseButton />
					</div>
					<ModalBody></ModalBody>
					<ModalFooter>
						<div className="filter-modal-apply-footer-container">
							<Button
								width={'20vw'}
								height="8vh"
								variant="ghost"
								onClick={handleKeepOldFilters}
							>
								Use old filter
							</Button>
							<Button
								width={'20vw'}
								background={'#ff5f00'}
								colorScheme="orange"
								height="8vh"
								mr={3}
								onClick={handleApplyFilters}
							>
								Apply New filter
							</Button>
						</div>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}

export default FilterModal
