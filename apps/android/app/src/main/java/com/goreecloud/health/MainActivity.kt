package com.goreecloud.health

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    HealthFoundationScreen()
                }
            }
        }
    }
}

data class HealthDomain(val title: String, val description: String)

private val healthDomains = listOf(
    HealthDomain("Activity", "Steps, distance, active time and workouts"),
    HealthDomain("Sleep", "Sleep sessions, duration and supported stages"),
    HealthDomain("Heart", "Heart rate and supported vital measurements"),
    HealthDomain("Body", "Weight and supported body measurements"),
    HealthDomain("Nutrition & hydration", "Food, nutrients and water when enabled"),
    HealthDomain("Mindfulness", "User-controlled wellbeing records")
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HealthFoundationScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = {
                Column {
                    Text("GoreeCloud", style = MaterialTheme.typography.labelMedium)
                    Text("Health", fontWeight = FontWeight.Bold)
                }
            })
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Text("Today", style = MaterialTheme.typography.labelLarge)
                        Text(
                            "Your health, without invented data.",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            "No source is connected. This foundation does not request Health Connect permissions or store health records.",
                            style = MaterialTheme.typography.bodyLarge
                        )
                    }
                }
            }

            item {
                Text(
                    "Health domains",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            items(healthDomains) { domain ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(
                        modifier = Modifier.padding(18.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(domain.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                        Text(domain.description, style = MaterialTheme.typography.bodyMedium)
                        Text("Not connected", style = MaterialTheme.typography.labelLarge)
                    }
                }
            }
        }
    }
}
