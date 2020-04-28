<template>
	<div>
		url: {{ conductor_url }}
		<button v-on:click="refresh_all">refresh all</button>
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
				{{ outgoing_friendship_requests }}
			</div>
			<div>
				incoming
				{{ incoming_friendship_requests }}
			</div>
			<div>
				<input v-model='new_friendship_request_target_agent_address' placeholder='agent address'/>
				<button v-on:click='request_friendship' >send new friend request</button>
			</div>
		</div>
		<div>
			Followers: 
			<p v-for="(follower, index) in followers" :key="index">{{ index }}: {{follower}}</p>
		</div>
		<div>
			Following: 
			<p v-for="(follower, index) in following" :key="index">{{ index }}: {{follower}}</p>
			<div>
				<input v-model='new_followship_target_agent_address' placeholder='agent address'/>
				<button v-on:click='follow'>follow</button>
			</div>
		</div>
		<div>
			<p>
				Test entries: 
					{{ test_entries }}
			</p>
			<p>
				Test entry addresses: 
					{{ test_entry_addresses }}
			</p>
			<div>
				<input v-model='new_test_entry_message'placeholder='entry message'/>
				<button v-on:click='make_test_entry' >make test entry</button>
				<p>
					address of most recenttly created entry: <br/>
					{{ recently_creates_test_entry_address }}
				</p>
			</div>
			<div>
				<input v-model='test_entry_address'placeholder='entry address'/>
				<button v-on:click='show_test_entry_message' >show message</button>
				<p>
					retrieved test entry message: <br />
					{{ retrieved_test_entry_message }}
				</p>
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
			following: [], 
			recently_creates_test_entry_address: "", 

			new_test_entry_message: "", 
			test_entries: [],
			test_entry_addresses: [],
			retrieved_test_entry_message: "", 
			test_entry_address: "",
		}
	},
	props: [
		'conductor_url',
		'conductor_instance'
	],
	methods: {
		refresh_all: function(event) {
			this.refresh_my_followings()
			this.refresh_my_followers()
			this.refresh_incoming_friendship_requests()
			this.refresh_outgoing_friendship_requests()
		},
		make_test_entry: function(event) {
			console.log("making new test entry")
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'make_test_entry'
			)({message: this.new_test_entry_message }).then(result => {
				result = JSON.parse(result) 
				this.recently_creates_test_entry_address = result.Ok
				this.refresh_test_entries()
			})
		}, 
		refresh_test_entries: function() {
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'get_test_entry_addresses'
			)({}).then(result => {
				result = JSON.parse(result) 
				this.test_entry_addresses = result.Ok
			})
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'get_test_entries'
			)({}).then(result => {
				result = JSON.parse(result) 
				this.test_entries = result.Ok
			})
		},		
		show_test_entry_message: function(event) {
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'get_test_entry'
			)({entry_address: this.test_entry_address}).then(result => {
				result = JSON.parse(result) 
				this.retrieved_test_entry_message = result.Ok.message
			})
		},
		request_friendship: function(event) {
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'request_friendship'
			)({other_agent: this.new_friendship_request_target_agent_address}).then(result => {
				result = JSON.parse(result) 
				console.log('follow friendship', result) 
				this.refresh_outgoing_friendship_requests()
				this.refresh_incoming_friendship_requests()
			})
		}, 
		follow: function(event) {
			console.log('follow') 
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'follow'
			)({target_agent_address: this.new_followship_target_agent_address}).then(result => {
				result = JSON.parse(result) 
				console.log('follow request result', result) 
				this.refresh_my_followings()
			})
		}, 
		refresh_my_followers: function() {
			// this.callZome(
			// 	this.conductor_instance, 
			// 	'social_graph', 
			// 	'my_followers'
			// )({}).then(result => {
			// 	result = JSON.parse(result) 
			// 	this.followers = result.Ok
			// 	// TODO
			// }) 
		},
		refresh_my_followings: function() {
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'my_followings'
			)({}).then(result => {
				result = JSON.parse(result) 
				this.following = result.Ok
				// TODO
			})
		},
		refresh_outgoing_friendship_requests: function() {
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'outgoing_friendship_requests'
				// 'my_followings'
			)({}).then(result => {
				result = JSON.parse(result)
				this.outgoing_friendship_requests = result.Ok
			})
		}, 
		refresh_incoming_friendship_requests: function() {
			this.callZome(
				this.conductor_instance, 
				'social_graph', 
				'incoming_friendship_requests'
				// 'my_followings'
			)({}).then(result => {
				result = JSON.parse(result)
				this.incoming_friendship_requests = result.Ok
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
			)({}).then(result => {
				try {
					var result = JSON.parse(result) 
					this.agent_address = result.Ok
					this.callZome = callZome
					this.refresh_all()
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
::placeholder {
	color: #aaa; 
}
button {
	border: 0.15em solid white;
	cursor: pointer;
}
button:hover{
	background-color:#fff6; 
}
</style>
