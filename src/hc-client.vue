<template>
	<div>
		url: {{ conductor_url }}
		<div v-if="callZome === undefined" style="color:#bb492f">
			not connected to the conductor
		</div>
		<div v-else style="color:#33bb44">
			connected to the conductor <br/>
			My agent address: {{ agent_address }}
		</div>
		<div>
			Friends:
		</div>
		<div>
			Friend requests: 
			<div>
				outgoing
			</div>
			<div>
				incoming
			</div>
			<div>
				<input v-model='new_friendship_request_target_agent_address'/>
				<button v-on:click='request_friendship' placeholder='agent address'>send new friend request</button>
			</div>
		</div>
		<div>
			Followers: 
		</div>
		<div>
			Following: 
			<div>
				<input v-model='new_followship_target_agent_address'/>
				<button v-on:click='follow' placeholder='agent address'>follow</button>
			</div>
		</div>
	</div>
</template>

<script>
import { connect } from '@holochain/hc-web-client'

export default {
	data: function() {
		return {
			agent_address: undefined, 
			callZome: undefined, 
			new_friendship_request_target_agent_address: undefined, 
			new_followship_target_agent_address: undefined, 
			incoming_friendship_requests: [],
			outgoing_friendship_requests: [], 
			followers: [], 
			following: []
		}
	},
	props: [
		'conductor_url',
		'conductor_instance'
	],
	methods: {
		request_friendship: function(event) {
			console.log('send new friend request to agent with address', this.new_friendship_request_target_agent_address)
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'request_friendship'
			)({args: {other_agent: this.new_friendship_request_target_agent_address}}).then(result => {
				this.refresh_outgoing_friendship_requests()
			})
		}, 
		follow: function(event) {
			console.log('follow', this.new_followship_target_agent_address)
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'follow'
			)({args: {target_agent_address: this.new_followship_target_agent_address}}).then(result => {
				this.refresh_my_followings()
			})
		}, 
		refresh_my_followings: function() {
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'my_followings'
			)({args: {}}).then(result => {
				console.log(result)
				// TODO
			})
		},
		refresh_outgoing_friendship_requests: function() {
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'outgoing_friendship_requests'
				// 'my_followings'
			)({args: {}}).then(result => {
				console.log(result) 
				// TODO
			})
		}
	},
	created: function() {
		this.hc_connection = connect({url: this.conductor_url})
		this.hc_connection.then(({callZome, close}) => {
			callZome(
				this.conductor_instance, 
				'social_graph', 
				'my_agent_address'
			)({args: {}}).then(result => {
				try {
					let parsed = JSON.parse(result) 
					this.agent_address = parsed.Ok
					this.callZome = callZome
					this.refresh_my_followings()
				} catch {
					console.error("bad response")
				}
			})
		})
	},
	components: {		
	}
}
</script>

<style>
div {
	color: #fff;
	margin: 10px;
	padding: 5px;
	background-color: rgba(90, 130, 200, 0.2);
	border-radius: 5px;
	border: 2px solid rgba(45, 65, 100, 0.5);
}
input, button {
	padding: 0.3em; 
	margin: 0.5em; 
	border-radius: 0.3em;
	background-color:#fff2;
	color:#fff; 
}
input {
	border: none; 
}
button {
	border: 0.15em solid white;
	cursor: pointer;
}
button:hover{
	background-color:#fff6; 
}
</style>
