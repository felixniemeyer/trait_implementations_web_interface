<template>
	<div>
		url: {{ conductor_url }}
		<div>
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
				<input v-model='new_friend_request_target_agent_address'/>
				<button v-on:click='sendFriendRequest' placeholder='agent address'>send new friend request</button>
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
			new_friend_request_target_agent_address: undefined, 
			new_followship_target_agent_address: undefined, 
			incoming_friend_requests: [],
			outgoing_friend_requests: [], 
			followers: [], 
			following: []
		}
	},
	props: [
		'conductor_url',
		'conductor_instance'
	],
	methods: {
		sendFriendRequest: function(event) {
			console.log('send new friend request to agent with address', this.new_friend_request_target_agent_address)
		}, 
		follow: function(event) {
			console.log('follow', this.new_followship_target_agent_address)
		}
	},
	created: function() {
		this.hc_connection = connect({url: this.conductor_url})
		this.hc_connection.then(({callZome, close}) => {
			callZome(
				'test-instance', 
				'social_graph', 
				'get_my_entry'
			)({args: {}}).then(result => {
				this.agent_address = result.Ok 
			})
		})
	},
	components: {		
	}
}
</script>

<style>
div {
	margin: 10px;
	padding: 5px;
	background-color: rgba(90, 130, 200, 0.2);
	border-radius: 5px;
	border: 2px solid rgba(45, 65, 100, 0.5);
}
</style>
