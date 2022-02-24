<script setup lang="ts">
  import { computed, ComputedRef } from 'vue'
  import { Ticket } from '../types'

  const props = defineProps<{
    ticketData: Ticket
  }>()

  const ticketPrice: ComputedRef<string> = computed(() => {
    const ruFormatter = new Intl.NumberFormat('ru')
    return `${ruFormatter.format(props.ticketData.price)} R`
  })

  function getStopsTitle(stops: Array<string>): string {
    let stopsTitle: string = ''
    if (stops.length > 1) {
      stopsTitle = `${stops.length} stops`
    }
    if (stops.length === 1) {
      stopsTitle = `${stops.length} stop`
    }
    if (stops.length === 0) {
      stopsTitle = `Direct flight`
    }
    return stopsTitle
  }

  function getSegmentDuration(duration: number): string {
    return `${Math.floor(duration / 60)}h ${duration % 60}m`
  }

  function getFromToDuration(date: string, duration: number): string {
    const fromTimestamp: number = new Date(date).getTime()
    const toTimestamp: number = duration * 60000 + fromTimestamp

    const fromDate: Date = new Date(fromTimestamp)
    const toDate: Date = new Date(toTimestamp)

    const fromHourString: string = String(fromDate.getHours()).padStart(2, '0')
    const fromMinutesString: string = String(fromDate.getMinutes()).padStart(
      2,
      '0'
    )
    const toHourString: string = String(toDate.getHours()).padStart(2, '0')
    const toMinutesString: string = String(toDate.getMinutes()).padStart(2, '0')

    return `${fromHourString}:${fromMinutesString} - ${toHourString}:${toMinutesString}`
  }
</script>

<template>
  <div class="ticket-card">
    <div
      style="display: flex; justify-content: space-between; margin-bottom: 20px"
    >
      <span class="ticket-price">
        {{ ticketPrice }}
      </span>
      <img
        :src="`//pics.avs.io/99/36/${ticketData.carrier}.png`"
        alt="Carrier logo"
        style="width: 110px; height: 36px"
      />
    </div>
    <div class="flight-segments">
      <div v-for="segment in ticketData.segments" class="segment-block">
        <div>
          <p class="segment-subtitle">
            {{ segment.origin }} - {{ segment.destination }}
          </p>
          <p class="segment-title">
            {{ getFromToDuration(segment.date, segment.duration) }}
          </p>
        </div>
        <div>
          <p class="segment-subtitle">Duration</p>
          <p class="segment-title">
            {{ getSegmentDuration(segment.duration) }}
          </p>
        </div>
        <div>
          <p class="segment-subtitle">
            {{ getStopsTitle(segment.stops) }}
          </p>
          <p class="segment-title">
            {{ segment.stops.join(', ') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .ticket-card {
    background-color: var(--color-white);
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 20px;
  }

  .ticket-price {
    color: var(--color-blue);
    font-size: 24px;
    font-weight: 600;
  }

  .flight-segments {
    display: grid;
    gap: 10px;
  }

  .segment-block {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .segment-subtitle {
    color: var(--color-grey);
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
    font-size: 12px;
    line-height: 18px;
  }

  .segment-title {
    color: var(--color-black);
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
  }
</style>
