<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCourse } from '@/entities/course'
import { Icon } from '@/shared/ui/icon'
import { TestResults } from '@/widgets/test-results'

const route = useRoute()
const courseId = computed(() => Number(route.params.id))
const testId = computed(() => Number(route.params.testId))

const { data: course } = useCourse(courseId)
const test = computed(() => course.value?.tests.find((item) => item.id === testId.value))
</script>

<template>
  <div>
    <RouterLink
      :to="{ name: 'course', params: { id: courseId } }"
      class="inline-flex items-center gap-1 text-sm font-medium text-ink-soft transition hover:text-ink"
    >
      <Icon name="chevron-left" size="18" />
      {{ course?.name ?? 'К курсу' }}
    </RouterLink>

    <header class="reveal mt-5">
      <h1 class="text-3xl font-extrabold tracking-tight">{{ test?.name ?? 'Результаты теста' }}</h1>
      <p class="mt-1 text-ink-soft">Результаты студентов курса</p>
    </header>

    <div class="reveal mt-8" style="--d: 80ms">
      <TestResults :course-id="courseId" :test-id="testId" />
    </div>
  </div>
</template>
