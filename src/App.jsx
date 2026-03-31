import { useEffect, useState } from 'react'
import axios from 'axios'
import { FaUserDoctor } from 'react-icons/fa6'

const api = axios.create({
  baseURL: 'https://smart-diagnosis-api-backend.onrender.com',
})

const KNOWN_SYMPTOMS = [
  'fever',
  'cough',
  'chest pain',
  'cold',
  'headache',
  'sore throat',
  'fatigue',
  'weakness',
  'body ache',
  'shortness of breath',
  'breathlessness',
  'runny nose',
  'stuffy nose',
  'nasal congestion',
  'nausea',
  'vomiting',
  'diarrhea',
  'constipation',
  'abdominal pain',
  'stomach pain',
  'bloating',
  'acidity',
  'heartburn',
  'dizziness',
  'chills',
  'sneezing',
  'loss of smell',
  'loss of taste',
  'joint pain',
  'back pain',
  'muscle pain',
  'ear pain',
  'tooth pain',
  'eye pain',
  'blurred vision',
  'itchy eyes',
  'skin rash',
  'itching',
  'dry skin',
  'swelling',
  'palpitations',
  'high blood pressure',
  'low blood pressure',
  'high sugar',
  'frequent urination',
  'burning urination',
  'dehydration',
  'loss of appetite',
  'increased appetite',
  'weight loss',
  'weight gain',
  'night sweats',
  'insomnia',
  'anxiety',
  'depression',
  'irritability',
  'confusion',
  'fainting',
  'seizure',
  'tingling',
  'numbness',
  'stiff neck',
  'neck pain',
  'knee pain',
  'leg pain',
  'hand pain',
  'wheezing',
  'phlegm',
  'dry cough',
  'wet cough',
  'blood in cough',
  'blood in stool',
  'blood in urine',
  'mouth ulcer',
  'bad breath',
  'yellow eyes',
  'yellow skin',
  'hair fall',
  'itchy throat',
]

const KNOWN_WORDS = Array.from(
  new Set(
    KNOWN_SYMPTOMS.flatMap((symptom) =>
      symptom
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.trim())
        .filter(Boolean),
    ),
  ),
)

const levenshteinDistance = (a, b) => {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0))

  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      )
    }
  }

  return dp[a.length][b.length]
}

const autocorrectPhrase = (phrase) => {
  const normalized = phrase.toLowerCase().trim()
  if (!normalized) return phrase

  let bestMatch = normalized
  let bestDistance = Infinity

  for (const known of KNOWN_SYMPTOMS) {
    const distance = levenshteinDistance(normalized, known)
    if (distance < bestDistance) {
      bestDistance = distance
      bestMatch = known
    }
  }

  const threshold = Math.max(1, Math.floor(normalized.length * 0.35))
  if (bestDistance <= threshold) {
    return bestMatch
  }

  const correctedWords = normalized.split(/\s+/).map((word) => {
    if (word.length <= 2) {
      return word
    }

    let closestWord = word
    let closestDistance = Infinity

    for (const knownWord of KNOWN_WORDS) {
      const distance = levenshteinDistance(word, knownWord)
      if (distance < closestDistance) {
        closestDistance = distance
        closestWord = knownWord
      }
    }

    const wordThreshold = Math.max(1, Math.floor(word.length * 0.34))
    return closestDistance <= wordThreshold ? closestWord : word
  })

  return correctedWords.join(' ')
}

const autocorrectSymptomsInput = (inputValue) => {
  const parts = inputValue
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) {
    return ''
  }

  const corrected = parts.map((part) => autocorrectPhrase(part))
  return corrected.join(', ')
}

const isSymptomRelated = (inputValue) => {
  const normalized = inputValue.toLowerCase().trim()
  const words = normalized.split(/\s+/).filter(Boolean)

  if (words.length === 0) {
    return false
  }

  // Allow any input - AI backend will handle validation
  // This lets users query any medical condition (diabetes, cancer, etc.)
  return true
}

function App() {
  const [symptoms, setSymptoms] = useState('')
  const [diagnosis, setDiagnosis] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [autocorrectMessage, setAutocorrectMessage] = useState('')
  const [deletingId, setDeletingId] = useState('')

  const loadHistory = async () => {
    try {
      const { data } = await api.get('/history')
      setHistory(data.history || [])
    } catch (_error) {
      setError('Could not load history')
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setAutocorrectMessage('')

    const trimmedSymptoms = symptoms.trim()
    if (!trimmedSymptoms) {
      setError('Please enter symptoms or conditions before submitting')
      return
    }

    const correctedSymptoms = autocorrectSymptomsInput(trimmedSymptoms)
    if (correctedSymptoms && correctedSymptoms !== trimmedSymptoms) {
      setAutocorrectMessage(`Autocorrected: ${correctedSymptoms}`)
      setSymptoms(correctedSymptoms)
    }

    setLoading(true)
    try {
      const { data } = await api.post('/diagnose', {
        symptoms: correctedSymptoms || trimmedSymptoms,
      })
      setDiagnosis(data.diagnosis || [])
      setSymptoms('')
      await loadHistory()
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Diagnosis request failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteHistory = async (id) => {
    if (!id) return

    setError('')
    setDeletingId(id)

    try {
      await api.delete(`/history/${id}`)
      setHistory((previous) => previous.filter((entry) => entry._id !== id))
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to delete history item')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#bfdbfe_0%,#dbeafe_28%,#e0f2fe_52%,#f0f9ff_100%)]">
      <nav className="sticky top-0 z-20 border-b border-sky-200/70 bg-sky-50/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <FaUserDoctor className="text-2xl text-sky-600" />
            <span className="text-lg font-bold tracking-wide text-slate-900 sm:text-xl">Smart Diagnosis AI</span>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50/95 to-cyan-50/95 p-6 shadow-[0_24px_64px_-30px_rgba(2,132,199,0.35)] backdrop-blur sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Describe Symptoms or Conditions</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">Enter any symptoms or health conditions to get AI-generated possible diagnoses.</p>

          <form onSubmit={handleSubmit} className="mt-6">
            <label htmlFor="symptoms" className="mb-2 block text-sm font-semibold text-slate-700">
              Symptoms
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="symptoms"
                value={symptoms}
                onChange={(event) => {
                  setSymptoms(event.target.value)
                  setAutocorrectMessage('')
                }}
                onBlur={() => {
                  const trimmed = symptoms.trim()
                  if (!trimmed) return

                  const corrected = autocorrectSymptomsInput(trimmed)
                  if (corrected && corrected !== trimmed) {
                    setSymptoms(corrected)
                    setAutocorrectMessage(`Autocorrected: ${corrected}`)
                  }
                }}
                placeholder="Example: fever, diabetes, cough, anxiety, chest pain"
                className="w-full rounded-xl border border-sky-200 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-300/50 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
              >
                {loading ? 'Diagnosing...' : 'Diagnose'}
              </button>
            </div>
          </form>

          {error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}
          {autocorrectMessage ? <p className="mt-2 text-sm font-medium text-emerald-700">{autocorrectMessage}</p> : null}

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Latest Result</h2>
            {diagnosis.length === 0 ? (
              <p className="mt-3 text-slate-500">No diagnosis generated yet.</p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {diagnosis.map((item, index) => (
                  <article
                    key={`${item.condition}-${index}`}
                    className="rounded-xl border border-sky-200 bg-white/85 p-4 shadow-md shadow-sky-200/50"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-sky-700">{item.probability}</p>
                    <h3 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">{item.condition}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.next_steps}</p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">History</h2>
            {history.length === 0 ? (
              <p className="mt-3 text-slate-500">No history found.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {history.map((entry) => (
                  <article key={entry._id} className="rounded-xl border border-sky-200 bg-white/90 p-4 shadow-md shadow-sky-200/40">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs text-slate-500 sm:text-sm">{new Date(entry.createdAt).toLocaleString()}</p>
                      <button
                        type="button"
                        onClick={() => handleDeleteHistory(entry._id)}
                        disabled={deletingId === entry._id}
                        className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === entry._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-800">Symptoms: {entry.symptoms}</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {(entry.result?.diagnosis || []).map((item, idx) => (
                        <li key={`${entry._id}-${idx}`}>
                          {item.condition} ({item.probability}) - {item.next_steps}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
