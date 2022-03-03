<script setup lang="ts">
  import TicketCard from './components/TicketCard.vue'
  import { computed, onMounted, ref, Ref, ComputedRef } from 'vue'
  import { Ticket, SearchIdResponse } from './types'

  const ticketsArray: Ref<Array<Ticket> | null> = ref(null)
  // const searchIdUrl: string = 'https://front-test.beta.aviasales.ru/search'
  // const getTicketsUrl: string = 'https://front-test.beta.aviasales.ru/tickets?searchId='

  // In case the aviasales server returns 502 error.
  const searchIdUrl = "https://avs-backend.now.sh/search";
  const getTicketsUrl = "https://avs-backend.vercel.app/tickets?searchId=";

  const sortCriteria: Ref<string> = ref('cheapest')
  const stopsFilter: Ref<Array<string>> = ref(['all'])

  async function getTickets(): Promise<void> {
    const searchIdResponse: SearchIdResponse = await fetch(searchIdUrl).then(
      (r) => r.json()
    )
    const searchId: string = searchIdResponse.searchId

    let ticketsResponse: Response = await fetch(`${getTicketsUrl}${searchId}`)

    while (
      !ticketsResponse.ok ||
      (await ticketsResponse
        .clone()
        .json()
        .then((r) => !r.stop))
    ) {
      ticketsResponse = await fetch(`${getTicketsUrl}${searchId}`)
    }
    const tickets = await ticketsResponse.json()
    ticketsArray.value = await tickets.tickets
    sortTickets()
  }

  const filteredTicketArray: ComputedRef<Array<Ticket> | undefined> = computed(
    () => {
      const proceedTicketsArray: Array<Ticket> | undefined =
        ticketsArray.value?.filter((ticket) => {
          if (stopsFilter.value.includes('all')) {
            return true
          } else if (
            stopsFilter.value.includes(
              String(ticket.segments[0].stops.length)
            ) &&
            stopsFilter.value.includes(String(ticket.segments[1].stops.length))
          ) {
            return true
          }
        })
      return proceedTicketsArray
    }
  )

  const arrayToShow: ComputedRef<Array<Ticket> | undefined> = computed(() => {
    return filteredTicketArray.value?.slice(0, sliceEnd.value)
  })

  const sliceEnd: Ref<number> = ref(5)

  function showMoreTickets(): number {
    return (sliceEnd.value += 5)
  }

  function filterTickets(): void {
    sliceEnd.value = 5
  }

  function sortTickets(): void {
    sliceEnd.value = 5
    if (sortCriteria.value === 'cheapest') {
      ticketsArray.value?.sort((a, b) => {
        return a.price - b.price
      })
    }
    if (sortCriteria.value === 'fastest') {
      ticketsArray.value?.sort((a, b) => {
        return (
          a.segments[0].duration +
          a.segments[1].duration -
          (b.segments[0].duration + b.segments[1].duration)
        )
      })
    }
  }

  onMounted(() => {
    getTickets()
  })
</script>

<template>
  <img alt="Aviasales logo" class="logo" src="./assets/img/logo.svg" />
  <div class="content-wrapper">
    <div class="stops-card">
      <p class="stops-header">Number of stops</p>
      <label class="stops-option">
        <input
          type="checkbox"
          v-model="stopsFilter"
          value="all"
          @change="filterTickets()"
        />
        <span class="checkmark"></span>
        All
      </label>
      <label class="stops-option">
        <input
          type="checkbox"
          v-model="stopsFilter"
          value="0"
          @change="filterTickets()"
        />
        <span class="checkmark"></span>
        Direct
      </label>
      <label class="stops-option">
        <input
          type="checkbox"
          v-model="stopsFilter"
          value="1"
          @change="filterTickets()"
        />
        <span class="checkmark"></span>
        1 stop
      </label>
      <label class="stops-option">
        <input
          type="checkbox"
          v-model="stopsFilter"
          value="2"
          @change="filterTickets()"
        />
        <span class="checkmark"></span>
        2 stops
      </label>
      <label class="stops-option">
        <input
          type="checkbox"
          v-model="stopsFilter"
          value="3"
          @change="filterTickets()"
        />
        <span class="checkmark"></span>
        3 stops
      </label>
    </div>
    <div class="tickets-wrapper">
      <div class="sort-buttons-block">
        <label
          class="sort-button"
          :class="{ 'btn-primary': sortCriteria === 'cheapest' }"
        >
          The cheapest
          <input
            v-model="sortCriteria"
            type="radio"
            name=""
            value="cheapest"
            @change="sortTickets()"
          />
        </label>
        <label
          class="sort-button"
          :class="{ 'btn-primary': sortCriteria === 'fastest' }"
        >
          The fastest
          <input
            v-model="sortCriteria"
            type="radio"
            name=""
            value="fastest"
            @change="sortTickets()"
          />
        </label>
      </div>
      <p v-if="ticketsArray === null" style="text-align: center">
        Loading tickets...
      </p>
      <p v-if="filteredTicketArray?.length === 0" style="text-align: center">
        There are no tickets that match your filter settings
      </p>
      <template v-else>
        <TicketCard
          v-for="(item, index) in arrayToShow"
          :ticket-data="item"
          :key="index"
        />
        <button
          v-if="
            filteredTicketArray !== undefined &&
            filteredTicketArray.length > sliceEnd
          "
          class="btn btn-primary"
          @click="showMoreTickets()"
        >
          Show 5 more flights
        </button>
      </template>
    </div>
  </div>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Open+Sans:wght@400;600&display=swap');
  @import './assets/styles/variables.css';
  @import './assets/styles/reset.css';

  #app {
    font-family: 'Open Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin: 50px;
  }

  body {
    margin: 0;
    background-color: var(--color-background);
  }

  .logo {
    display: block;
    margin: auto;
    margin-bottom: 50px;
  }

  .content-wrapper {
    max-width: 754px;
    margin: auto;
    display: grid;
    grid-template-columns: 232fr 502fr;
    gap: 20px;
    align-items: start;
  }

  .stops-card {
    position: sticky;
    top: 20px;
    background-color: var(--color-white);
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }

  .tickets-wrapper {
    display: grid;
    gap: 20px;
  }

  .stops-header {
    margin: 20px 20px 10px 20px;
    font-weight: 600;
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--color-black);
  }

  .stops-option {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    color: var(--color-black);
    font-size: 13px;
    line-height: 20px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .stops-option:hover {
    background-color: var(--color-light-blue);
  }

  .checkmark {
    position: relative;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    border: 1px solid var(--color-blue-grey);
    border-radius: 2px;
  }

  .stops-option input {
    display: none;
  }

  .stops-option input:checked ~ .checkmark {
    border: 1px solid var(--color-blue);
  }

  .stops-option input:checked ~ .checkmark::after {
    content: url(../src/assets/img/tick.svg);
    position: absolute;
    top: -1px;
    left: 3px;
  }

  .sort-buttons-block {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .sort-button {
    color: var(--color-black);
    background-color: var(--color-white);
    padding: 15px;
    text-align: center;
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    border: 1px solid var(--color-light-grey);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .sort-button:hover {
    opacity: 0.7;
  }

  .sort-button:first-of-type {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .sort-button:last-of-type {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .sort-button input {
    display: none;
  }

  .sort-button:not(:last-of-type) {
    border-right: none;
  }

  .btn-primary.sort-button {
    border: 1px solid var(--color-blue);
  }

  .btn {
    padding: 15px 20px;
    border: none;
    border-radius: 5px;
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
  }

  .btn:hover {
    opacity: 0.7;
  }

  .btn:active {
    opacity: 1;
  }

  .btn-primary {
    background-color: var(--color-blue);
    color: var(--color-white);
  }
</style>
