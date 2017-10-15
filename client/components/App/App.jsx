import React from 'react';
import styles from "./App.css";

export default class App extends React.Component {

	constructor() {
		super();
		this.fetchTrackLyrics = this.fetchTrackLyrics.bind(this);
		this.fetchTrackId = this.fetchTrackId.bind(this);
		this.getTrackDetails = this.getTrackDetails.bind(this);
	}

	fetchTrackId(resolve, reject){
		
			const apiKey = "8e56e3fe5dc95068f3d351f91b2b1d56";
			var artistName = "Taylor Swift";
			var trackName = "Look What You Made Me Do";

			const url = "http://api.musixmatch.com/ws/1.1/track.search?q_artist="+artistName+"&q_track="+trackName+"&apikey="+apiKey;
			console.log("Fetching track ID");

			fetch(url)
			.then((resp)=>resp.json())
			.then(function(data){
				// retrieve response obj
				const response = data.message.body.track_list;
				console.log(response);
				for(let track of response){
					try {
						let { track_id, track_name } = track.track;
						console.log(track_id);
						console.log(track_name);
						resolve(track_id);
					} catch(error){
						throw error;
					}
				}
			}) 
			.catch(function(error) {
	    		reject(error);
	  		});
		

	}

	fetchTrackLyrics(id) {
		const apiKey = "8e56e3fe5dc95068f3d351f91b2b1d56";

		console.log("Fetching Lyrics");
		const url = "http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id="+id+"&apikey="+apiKey;

		fetch(url)
		.then((resp)=>resp.json())
		.then(function(data){
			console.log(data);
		}) 
		.catch(function(error) {
    		console.log(error);
  		});   
	}
	
	getTrackDetails(){
		
		new Promise(this.fetchTrackId)
		.then(this.fetchTrackLyrics)
		.catch((error)=>{
			console.log(error);
		});

	}

	componentDidMount(){
		this.getTrackDetails();
	}

	render() {
		return (
        	<h1 className={styles.test}>
        		
        	</h1>
		);
	}
}
