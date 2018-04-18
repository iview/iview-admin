<template>
	<div>
		<Row :gutter="10">
			<Col span="6">
				<Card :padding="4">
					<div class="scroll-container">
						<scroll-bar
							scroll-y-type="inner"
						>
							<p v-for="i in 100" :key="`item-${i}`">item - {{ i }}</p>
						</scroll-bar>
					</div>
				</Card>
			</Col>
			<Col span="6">
				<Card :padding="4">
					<div class="scroll-container">
						<scroll-bar>
							<p class="list-item" v-for="i in 6" :key="`item-${i}`">item - {{ i }} - item-long-show-x-scrollbar- long-text-make-scroller-x-show-and-useable - item-long-show-x-scrollbar</p>
						</scroll-bar>
					</div>
				</Card>
			</Col>
			<Col span="6">
				<Card :padding="4">
					<div class="scroll-container">
						<scroll-bar show-all>
							<p v-for="i in 100" :key="`item-${i}`">item - {{ i }}</p>
						</scroll-bar>
					</div>
				</Card>
			</Col>
			<Col span="6">
				<Card :padding="4">
					<div class="scroll-container">
						<scroll-bar show-all>
							<p class="list-item" v-for="i in 6" :key="`item-${i}`">item - {{ i }} - item-long-show-x-scrollbar- long-text-make-scroller-x-show-and-useable - item-long-show-x-scrollbar</p>
						</scroll-bar>
					</div>
				</Card>
			</Col>
		</Row>
		<Row :style="{marginTop: '10px'}" :gutter="10">
			<Col span="6">
				<Card :padding="4">
					<div class="scroll-container">
						<scroll-bar show-all dis-scroll-x>
							<p class="list-item" v-for="i in 100" :key="`item-${i}`">item - {{ i }} - item-long-show-x-scrollbar- long-text-make-scroller-x-show-and-useable - item-long-show-x-scrollbar</p>
						</scroll-bar>
					</div>
				</Card>
			</Col>
			<Col span="6">
				<Card :padding="4">
					<div class="scroll-container">
						<scroll-bar show-all dis-scroll-y>
							<p class="list-item" v-for="i in 100" :key="`item-${i}`">item - {{ i }} - item-long-show-x-scrollbar- long-text-make-scroller-x-show-and-useable - item-long-show-x-scrollbar</p>
						</scroll-bar>
					</div>
				</Card>
			</Col>
			<Col span="6">
				<Card :padding="4">
					<div class="scroll-container">
						<scroll-bar show-all scroll-x="none">
							<p class="list-item" v-for="i in 100" :key="`item-${i}`">item - {{ i }} - item-long-show-x-scrollbar- long-text-make-scroller-x-show-and-useable - item-long-show-x-scrollbar</p>
						</scroll-bar>
					</div>
				</Card>
			</Col>
			<Col span="6">
				<Card :padding="4">
					<div class="scroll-container">
						<scroll-bar>
							<p class="list-item" v-for="i in 100" :key="`item-${i}`">item - {{ i }} - item-long-show-x-scrollbar- long-text-make-scroller-x-show-and-useable - item-long-show-x-scrollbar</p>
						</scroll-bar>
					</div>
				</Card>
			</Col>
		</Row>
	</div>
</template>

<script>
import scrollBar from './vue-scroller-bars';
export default {
    name: 'scroll-bar-page',
    components: {
        scrollBar
    }
};
</script>

<style lang="less">
.scroll-container{
	height: 260px;
}
.list-item{
	word-break: keep-all;
	white-space: nowrap;
}
</style>
