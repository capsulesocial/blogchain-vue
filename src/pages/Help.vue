<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRootStore } from '@/store/index';

import Plus from '@/components/icons/PlusIcon.vue';
import Minus from '@/components/icons/MinusIcon.vue';
import OnboardingWizard from '@/components/popups/OnboardingWizard.vue';

const rootStore = useRootStore();

interface IQuestion {
	id: number;
	title: string;
	question: string;
	isOpen: boolean;
}

const displayOnboarding = computed(() => rootStore.$state.recentlyJoined);
const questions = ref<IQuestion[]>([
	{
		id: 0,
		title: `How do I get started?`,
		question: `You can <a href="/login" class="text-primary font-semibold">login</a> using Google, Discord, your NEAR
                    wallet, or by generating Blogchain private key. For the last two methods, importing a Blogchain private
                    key is required. We create a NEAR wallet for each new user (unless they already have one), which is
                    required in order to invoke a smart contract. Invoking smart contracts costs a small fee, but we are
                    committed to keeping Blogchain free and will front this cost for everyone.<br /><br />
                    Users, therefore, do not have to ever interact with their NEAR wallet. Once logged in, an onboarding guide
                    will walk you through the main Blogchain features, as well as setting up your profile!`,
		isOpen: true,
	},
	{
		id: 1,
		title: `What is web3?`,
		question: `If you want to find out more about web3, please read our article
                    <a
                        href="https://blogchain.app/p/decentralization-basics-for-writers-what-is-web3/i6KczgY9Wt"
                        target="_blank"
                        class="text-primary font-semibold"
                        >Decentralization Basics for Writers: What is Web3?</a
                    >`,
		isOpen: false,
	},
	{
		id: 2,
		title: `What’s the difference between Capsule Social and Blogchain?`,
		question: `Blogchain is created and operated by
                    <a href="http://capsule.social/" target="_blank" class="text-primary font-semibold">Capsule Social</a>. Capsule Social
                    makes innovative tools to enable decentralized discourse. Our initial product is Blogchain, a publishing
                    platform designed to empower writers as never before.`,
		isOpen: false,
	},
	{
		id: 3,
		title: `How is Blogchain different from other social networks?`,
		question: `Our platform is proudly a Web3 ecosystem, built upon the core principle of decentralization. We strongly
                    believe this is the best way to empower writers both creatively and economically. <br />
                    <br />

                    By contrast, existing Web2 systems like Facebook and Twitter essentially act as centralized middlemen who
                    insinuate themselves between creators and their audience as a way to extract
                    <a
                        href="https://corporatefinanceinstitute.com/resources/knowledge/economics/rent-seeking/"
                        target="_blank"
                        class="text-primary font-semibold"
                        >rent seeking</a
                    >
                    profits.`,
		isOpen: false,
	},
	{
		id: 4,
		title: `What makes Blogchain different from other web3 social platforms?`,
		question: `In short, Blogchain provides the best combination of user-friendliness, social features, and integration
                    of powerful web3 tools like the NEAR protocol, OrbitDB, and IPFS. We’ve tried to make publishing content
                    to the decentralized web as easy for non-technical users as it is to post on familiar web2 services. By
                    comparison, other web3 social products tend to be more targeted to developers or, at the very least,
                    people who are already blockchain aficionados.`,
		isOpen: false,
	},
	{
		id: 5,
		title: `How does Blogchain use blockchain technology?`,
		question: `Blockchain is an important tool used to implement our broader idea of decentralization, which ultimately
                    enhances the independence and freedom of speech for writers.<br /><br />

                    We use the NEAR protocol to manage the flow of user activity on the platform. User content is stored to
                    OrbitDB, which is a decentralized database that ensures immutability across multiple nodes. This ensures a
                    greater resistance against censorship often found on centralized platforms. Such social network platforms
                    use company controlled servers that ultimately give them sole authority on who gets to post what and
                    when.<br /><br />

                    In the future, we also plan to implement blockchain-based features that enable payments to creators for
                    their work, as well as community-based governance of the Blogchain platform.`,
		isOpen: false,
	},
	{
		id: 6,
		title: `What is IPFS, and how does it work within Blogchain?`,
		question: `IPFS is a peer-to-peer (meaning no central server) storage network that finds data using content
                    addressing as opposed to location addressing. This difference is important because it is what allows us to
                    verify using a unique content identifier (CID) that the content we receive is the legitimate one
                    requested. We use IPFS to decentralize the transfer of data and to distribute the content to multiple
                    nodes in order to increase accessibility and decrease any takedowns.`,
		isOpen: false,
	},
	{
		id: 7,
		title: `What is NEAR protocol, and how does it work within Blogchain?`,
		question: `NEAR protocol is a blockchain that stores smart contracts (code stored on a blockchain). Upon
                    registration, each user invokes a smart contract where their username and public key (like a signature
                    which has a corresponding private key) are stored. When users post content, they automatically sign it
                    with their private key, which we then validate with the public key stored on NEAR. This process allows us
                    to ensure the validity of users and their posts. We also use NEAR protocol to authenticate user activity
                    such as comments, follows, and reposts.`,
		isOpen: false,
	},
	{
		id: 8,
		title: `Do I need a crypto wallet to use the platform?`,
		question: `Technically, yes. But if you don’t have one, we make setup really easy for newbies:<br /><br />

                    Simply sign in with your existing Google or Discord identity, and the software will automatically create a
                    wallet for you on the NEAR network, which Blogchain uses to handle on-chain transactions. That’s it.<br /><br />

                    Of course, if you <span class="font-bold">do</span> already have a NEAR-compatible wallet, no need to set
                    up a new one. Just use your your existing wallet to sign up.`,
		isOpen: false,
	},
	{
		id: 9,
		title: `Can I post on Blogchain for free?`,
		question: `Yes. We want this to always be the case, so our social network can be used by a wide variety of writers in
                    different fields to share their ideas.`,
		isOpen: false,
	},
	{
		id: 10,
		title: `But then how does Blogchain make money?`,
		question: `Blogchain is created and operated by
                    <a href="http://capsule.social/" target="_blank" class="text-primary font-semibold">Capsule Social</a>. We offer users
                    the ability to create paid subscription models for their posts, whereby Capsule Social retains a 10%
                    transaction fee.<br /><br />

                    What we will <span class="font-bold">not</span> do, however, is sell ads or user information to third
                    parties. We want to implement a business model for ourselves and our creators that is truly a win-win
                    proposition, contrary to the exploitation that has become par for the course on other social networks.`,
		isOpen: false,
	},
	{
		id: 11,
		title: `If I set up a paid publication, does all my content have to be paid?`,
		question: `We offer users the ability to create paid subscription models for their posts. Writers can manage how many
                    subscription tiers they offer, how much each subscription costs, and which of their posts falls under
                    which tier. Writers can just as easily make certain posts non-paid, and thereby viewable to all.`,
		isOpen: false,
	},
	{
		id: 12,
		title: `What fees can I expect when creating a subscription offering for my posts?`,
		question: `An industry-standard 10% platform fee is deducted from the payout, plus Stripe transaction fees, should
                    you elect to use Stripe as your payment processor.`,
		isOpen: false,
	},
	{
		id: 13,
		title: `How does the platform use my personal data?`,
		question: `Unlike traditional social networks, Blogchain does not algorithmically profile users, track you around the
                    web, or sell ads to target your interests. If you share your email address or other information with us,
                    we only use it to send you updates about Blogchain. That’s it.`,
		isOpen: false,
	},
	{
		id: 14,
		title: `How does Blogchain's algorithms works?`,
		question: `The term algorithm has been used lately in the mainstream to describe the ways in which Big Tech controls
                    and manipulates the content you see. But simply, algorithms are just a set of instructions given to a
                    computer to perform a desired task. Algorithms are essential in all programming, and we find it important
                    to be as transparent as possible with how we have written our algorithms. In Blogchain, you will see three
                    main feeds all using very intuitive algorithms: <br /><br />
                    <ul class="text-gray5 dark:text-gray3">
                    <li>
                        1. <span class="font-bold">Following:</span> Here you will see content sorted in chronological order
                        from yourself and all users you follow.
                    </li>
                    <li>
                        2. <span class="font-bold">New:</span> Here you will see all content published on Blogchain sorted using
                        timestamps.
                    </li>
                    <li>
                        3. <span class="font-bold">Top:</span> Each post has certain statistics (number of reposts, number of
                        comments, number of comments by unique users) which is then analyzed to sort this feed by popularity.
                    </li>
                </ul>`,
		isOpen: false,
	},
	{
		id: 15,
		title: `Can I delete my posts?`,
		question: `You can certainly remove posts from your profile. The removed post will no longer be discoverable via
                    tags, reposts, or Blogchain’s feed.<br /><br />

                    However, each post has a unique CID (content identifier), and we do not remove this CID from our database
                    (OrbitDB). Instead, we add it to another database consisting of deleted content. Because of this, while
                    posts are no longer discoverable, those who know the CID for a post can still load the content.<br /><br />

                    Furthermore, since post content is added to IPFS, anyone who runs an IPFS node can store the content of
                    the post. IPFS searches for data in the network using CIDs, so the post will always load as long as one
                    person in the network is hosting the content. We at Capsule Social do not have control over this and
                    therefore cannot facilitate any hard deletions.<br /><br />

                    Users can similarly remove their comments on posts, as well as comments from others under their own posts.
                    <br /><br />

                    Please keep this all in mind as you publish your posts!`,
		isOpen: false,
	},
	{
		id: 16,
		title: `What type of moderation exists on Blogchain?`,
		question: `Our plan is to instill community moderation. For now, we retain the ability to block users in order to
                    ensure our collective space is not compromised by those who seek to abuse our platform. We currently have
                    a <router-link to="/contentpolicy" class="text-primary">Content Moderation Policy</router-link> that outlines
                    our motives and methods for such cases. This will eventually pivot towards a decentralized,
                    community-based governance model.`,
		isOpen: false,
	},
	{
		id: 17,
		title: `Do I own my content on Blogchain?`,
		question: `Any original content you publish to Blogchain remains yours and is protected by copyright and any other
                    applicable intellectual property laws. However, please note that you agree to grant us a limited license
                    to your content, which allows us to promote your content and help you succeed on Blogchain.`,
		isOpen: false,
	},
	{
		id: 18,
		title: `Can I repost content originally published on another site?`,
		question: `If you have complete ownership of the content and didn't sign an exclusive agreement that you would never
                    repost your content elsewhere, yes! For example, you can repost an article that was originally on your
                    Medium account.`,
		isOpen: false,
	},
	{
		id: 19,
		title: `Can I share my Blogchain content on other platforms?`,
		question: `Yes. Each post on our platform generates a hyperlink that is usable anywhere on the web, including for
                    purposes of sharing to other social networks. We even integrate Blogchain with a few of the more popular
                    third-party services, like Twitter, to make sharing as easy as clicking a button.`,
		isOpen: false,
	},
	{
		id: 20,
		title: `Can multiple writers write for a single Blogchain post?`,
		question: `Not at the moment. However, if this feature is important to you, make sure you add your suggestions to our
                    “#wish-list” channel on Discord. Every week, our team reviews every suggestion and prioritizes them based
                    on the number of requests received.`,
		isOpen: false,
	},
	{
		id: 21,
		title: `Can I write in a language other than English?`,
		question: `You can write in any language on Blogchain. However, the dashboard will remain in English. As our platform
                    grows, and as we receive more requests, we will include different languages. Thank you for your patience.`,
		isOpen: false,
	},
	{
		id: 22,
		title: `Do my followers receive an email notification when I post on my Blogchain?`,
		question: `Not at the moment. However, if this feature is important to you, make sure you add your suggestions to our
                    “#wish-list” channel on Discord. Every week, our team reviews every suggestion and prioritizes them based
                    on the number of requests received.`,
		isOpen: false,
	},
	{
		id: 23,
		title: `Does Capsule Social have a referral program?`,
		question: `We currently don’t have a referral program.`,
		isOpen: false,
	},
	{
		id: 24,
		title: `Do you offer crypto tips to users who find and report relevant bugs?`,
		question: `Thank you for your interest. Unfortunately, not at this time. However, if anything changes, we’ll make
                    sure to communicate it with our community through our Discord server.`,
		isOpen: false,
	},
	{
		id: 25,
		title: `Where can I make suggestions for improvement?`,
		question: `You can add your suggestions to our “#wish-list” channel on Discord. From there, we’ll take it back to the
							team to discuss and hopefully roll out!<br /><br />

							You can also submit any suggestions or issues using our form:
							<a
								href="https://xc633ok49p2.typeform.com/to/v5Xrfcpp?typeform-source=blogchain.apphttps://xc633ok49p2.typeform.com/to/v5Xrfcpp?typeform-source=blogchain.app"
								target="_blank"
								class="text-primary font-semibold"
								>here</a
							>`,
		isOpen: false,
	},
	{
		id: 26,
		title: `Still have an unanswered question?`,
		question: `Reach out to us through
                    <a href="https://discord.gg/HhVbaD2BHY" target="_blank" class="text-primary font-semibold">Discord</a> or at
                    <a href="mailto:support@capsule.social" target="_blank" class="text-primary font-semibold">support@capsule.social</a>`,
		isOpen: false,
	},
]);

function toggleAccordion(id: number) {
	questions.value[id].isOpen = !questions.value[id].isOpen;
}
</script>

<template>
	<article class="px-4 py-4 xl:px-6 xl:py-5">
		<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold xl:text-4xl">Need Some Help?</h1>
		<h3 class="text-primary mt-4 text-xl font-semibold">Frequently Asked Questions</h3>
	</article>
	<div
		id="scrollable_content"
		class="min-h-180 h-180 lg:min-h-200 lg:h-200 xl:min-h-210 xl:h-210 w-full overflow-y-auto lg:overflow-y-hidden relative px-6 pb-6"
	>
		<article v-for="question in questions" :key="question.id" class="message mb-4 w-full xl:w-10/12">
			<div class="message-header relative flex items-center justify-between" @click="toggleAccordion(question.id)">
				<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
					{{ question.title }}
				</h4>
				<Plus
					:class="question.isOpen ? `plus0` : `plus1`"
					class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
				/>
				<Minus
					:class="!question.isOpen ? `minus0` : `minus1`"
					class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
				/>
			</div>
			<div :class="question.isOpen ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
				<!-- eslint-disable-next-line vue/no-v-html -->
				<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm" v-html="question.question"></p>
			</div>
		</article>
		<!-- Onboarding Wizard -->
		<OnboardingWizard v-if="displayOnboarding" />
	</div>
</template>

<style>
.message-header {
	cursor: pointer;
}

.message-header .icon {
	transition: all 0.6s;
}

.message-body {
	padding: 0;
	max-height: 20em;
	overflow: hidden;
	transition: all 0.6s;
}

.plus0 {
	opacity: 0;
}

.plus1 {
	opacity: 1;
}

.minus0 {
	opacity: 0;
}

.minus1 {
	opacity: 1;
}

.is-closed {
	max-height: 0;
}
</style>
