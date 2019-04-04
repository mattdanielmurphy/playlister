async function getSongs({ dbx }) {
	const songs = []
	await dbx
		.filesListFolder({ path: '' })
		.then((response) => {
			// get just songs... getting all files right now
			for (let i in response.entries) songs.push(response.entries[i])
		})
		.catch((error) => {
			console.error(error)
		})
	return songs
}

export default getSongs
