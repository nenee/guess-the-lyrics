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
			let artistName = "Katy Perry";
			let trackName = "I Kissed A Girl";

			const url = "http://api.musixmatch.com/ws/1.1/track.search?q_artist="+artistName+"&q_track="+trackName+"&apikey="+apiKey;
			console.log("Fetching track ID");

			fetch(url)
			.then((resp)=>resp.json())
			.then(function(data){
				// retrieve response obj
				const trackList = data.message.body.track_list;
				console.log(trackList);
				const filtered = trackList.filter(removeRemixes);
				console.log(filtered);
				if(filtered.length > 0) resolve(filtered[0].track.track_id); 
				else reject("No non-remixes found"); 
			}) 
			.catch(function(error) {
	    		reject(error);
	  		});
		
			function removeRemixes(title){
				let {track_name } = title.track;
				if(track_name.toLowerCase().indexOf("remix") > -1) return false;
				if(track_name.toLowerCase().indexOf("rmx") > -1) return false;
				if(track_name.toLowerCase().indexOf("mix") > -1) return false;
				return true;
			}
	}

	fetchTrackLyrics(id) {
		
		const apiKey = "8e56e3fe5dc95068f3d351f91b2b1d56";

		console.log("Fetching Lyrics");
		const url = "http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id="+id+"&apikey="+apiKey;

		fetch(url)
		.then((resp)=>resp.json())
		.then(function(data){
			console.log(data);
			console.log("id: "+id);
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
