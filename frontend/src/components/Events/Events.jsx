import React from "react"
import styles from "../../styles/styles"
import EventCard from "./EventCard"
import { useSelector } from "react-redux"

const Events = () => {
	const { allEvents, isLoading } = useSelector((state) => state.event)

	console.log(allEvents)
	return (
		<div>
			{!isLoading && (
				<div className={`${styles.section}`}>
					<div className={`${styles.heading}`}>
						<h1>Popular Events</h1>
					</div>

					<div className="w-full grid">
						{allEvents?.length !== 0 && (
							<EventCard data={allEvents && allEvents[0]} />
						)}

						{allEvents?.length === 0 && (
							<h4>There are no events at the moment</h4>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default Events
