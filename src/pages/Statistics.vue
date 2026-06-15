<template>
  <div class="statistics-page">
    <div class="container--main">
      <h1 class="page-title">Uruguay Statistics</h1>
      <p class="page-subtitle">Key data and statistics about Uruguay</p>

      <div class="stats-grid-large">
        <Card title="Population">
          <div class="stat-display">
            <div class="stat-number">3.5M</div>
            <p class="stat-description">Total population (2024)</p>
            <div class="stat-detail">
              <strong>Capital:</strong> Montevideo (1.3M)
            </div>
          </div>
        </Card>

        <Card title="Economy">
          <div class="stat-display">
            <div class="stat-number">GDP: $68B</div>
            <p class="stat-description">Nominal GDP (2023)</p>
            <div class="stat-detail">
              <strong>Per Capita:</strong> $19,400
            </div>
          </div>
        </Card>

        <Card title="Area">
          <div class="stat-display">
            <div class="stat-number">176,220</div>
            <p class="stat-description">km² (68,034 sq mi)</p>
            <div class="stat-detail">
              <strong>Coastline:</strong> 1,055 km
            </div>
          </div>
        </Card>

        <Card title="Official Language">
          <div class="stat-display">
            <div class="stat-number">Spanish</div>
            <p class="stat-description">Rioplatense Spanish dialect</p>
            <div class="stat-detail">
              <strong>Literacy Rate:</strong> 98.1%
            </div>
          </div>
        </Card>
      </div>

      <div class="sections">
        <section class="stat-section">
          <h2 class="section-title">Demographics</h2>
          <div class="stat-list">
            <div class="stat-item">
              <span class="label">Life Expectancy</span>
              <span class="value">76.5 years</span>
            </div>
            <div class="stat-item">
              <span class="label">Median Age</span>
              <span class="value">34.2 years</span>
            </div>
            <div class="stat-item">
              <span class="label">Urban Population</span>
              <span class="value">95.5%</span>
            </div>
            <div class="stat-item">
              <span class="label">Population Growth</span>
              <span class="value">0.25% annually</span>
            </div>
          </div>
        </section>

        <section class="stat-section">
          <h2 class="section-title">Education</h2>
          <div class="stat-list">
            <div class="stat-item">
              <span class="label">Primary Education Enrollment</span>
              <span class="value">99.2%</span>
            </div>
            <div class="stat-item">
              <span class="label">Secondary Education</span>
              <span class="value">94.1%</span>
            </div>
            <div class="stat-item">
              <span class="label">Tertiary Education</span>
              <span class="value">42.3%</span>
            </div>
            <div class="stat-item">
              <span class="label">Global Education Index Rank</span>
              <span class="value">19th worldwide</span>
            </div>
          </div>
        </section>

        <section class="stat-section">
          <h2 class="section-title">Healthcare</h2>
          <div class="stat-list">
            <div class="stat-item">
              <span class="label">Healthcare Expenditure</span>
              <span class="value">9.2% of GDP</span>
            </div>
            <div class="stat-item">
              <span class="label">Physicians per 10,000</span>
              <span class="value">42.8</span>
            </div>
            <div class="stat-item">
              <span class="label">Hospital Beds per 10,000</span>
              <span class="value">27.3</span>
            </div>
            <div class="stat-item">
              <span class="label">Universal Healthcare Coverage</span>
              <span class="value">100%</span>
            </div>
          </div>
        </section>

        <section class="stat-section">
          <h2 class="section-title">Infrastructure</h2>
          <div class="stat-list">
            <div class="stat-item">
              <span class="label">Paved Roads</span>
              <span class="value">8,950 km</span>
            </div>
            <div class="stat-item">
              <span class="label">Internet Penetration</span>
              <span class="value">88.5%</span>
            </div>
            <div class="stat-item">
              <span class="label">Mobile Phone Users</span>
              <span class="value">140% of population</span>
            </div>
            <div class="stat-item">
              <span class="label">Airport (main)</span>
              <span class="value">Carrasco Int'l (MVD)</span>
            </div>
          </div>
        </section>

        <section class="stat-section">
          <h2 class="section-title">Environment</h2>
          <div class="stat-list">
            <div class="stat-item">
              <span class="label">Renewable Energy Usage</span>
              <span class="value">63% of electricity</span>
            </div>
            <div class="stat-item">
              <span class="label">Deforestation Rate</span>
              <span class="value">-0.1% (reforestation)</span>
            </div>
            <div class="stat-item">
              <span class="label">Carbon Emissions per Capita</span>
              <span class="value">1.9 tonnes CO₂</span>
            </div>
            <div class="stat-item">
              <span class="label">Environmental Performance Index</span>
              <span class="value">27th worldwide</span>
            </div>
          </div>
        </section>

        <section class="stat-section">
          <h2 class="section-title">Government & Politics</h2>
          <div class="stat-list">
            <div class="stat-item">
              <span class="label">Government Type</span>
              <span class="value">Presidential Republic</span>
            </div>
            <div class="stat-item">
              <span class="label">Independence Date</span>
              <span class="value">August 25, 1828</span>
            </div>
            <div class="stat-item">
              <span class="label">Democracy Index</span>
              <span class="value">Full Democracy (9.04/10)</span>
            </div>
            <div class="stat-item">
              <span class="label">Corruption Perception Index</span>
              <span class="value">23rd least corrupt</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
</script>

<style scoped>
.statistics-page {
  padding: 2rem 0;
}

.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.page-subtitle {
  margin: 0 0 2rem 0;
  font-size: 1rem;
  color: var(--color-text-muted);
}

.stats-grid-large {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-display {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-description {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.stat-detail {
  font-size: 0.9rem;
  color: var(--color-foreground);
}

.stat-detail strong {
  display: block;
  font-weight: 600;
}

.sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.stat-section {
  background: var(--background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.section-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary-light);
  padding-bottom: 0.75rem;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.stat-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  font-weight: 500;
  flex: 1;
}

.value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-primary);
  text-align: right;
  flex: 0 0 auto;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .stats-grid-large {
    grid-template-columns: 1fr;
  }

  .sections {
    grid-template-columns: 1fr;
  }

  .stat-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .value {
    text-align: left;
  }
}
</style>
