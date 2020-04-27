<template>
	<div id="app">
		HC conductor protocol: <input type="text" v-model="hc_conductor_protocol" /> <br/> 
		HC conductor host: <input type="text" v-model="hc_conductor_host" /> <br/> 
		HC conductor port: <input type="text" v-model="hc_conductor_port" /> <br/>
		HC conductor instance: <input type="text" v-model="conductor_instance" /> <br/>
		<button v-on:click="setConductor">set conductor</button>
		<div v-if="conductor_url === undefined">
			set conductor in order to proceed
		</div>
		<div v-else>
			<p> currently using conductor {{ conductor_url }} </p>
			<HcClient 
				v-bind:conductor_url="conductor_url"
				v-bind:conductor_instance="conductor_instance"/>
		</div>
	</div>
</template>

<script>
import HcClient from './hc-client.vue'

export default {
	data: function() {
		return {
			hc_conductor_protocol: 'ws',
			hc_conductor_host: 'localhost',
			hc_conductor_port: 8888,
			conductor_instance: 'test-instance1',
			conductor_url: undefined
		}
	},
	methods: {
		setConductor: function(event) {
			this.conductor_url = 
				this.hc_conductor_protocol + '://' + 
				this.hc_conductor_host + ':' +
				this.hc_conductor_port
		}
	},
	components: {		
		HcClient
	}
}
</script>

<style>
</style>
