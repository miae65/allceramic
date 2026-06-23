'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { JobKind, JobPost } from '@/types'

type Props = {
  userId: string
  postId?: string
  initial?: Partial<JobPost>
  defaultKind?: JobKind
}

const HIRING_WORK_TYPES = ['정규직', '파트타임', '단기', '프리랜서']
const SEEKING_WORK_TYPES = ['정규직', '파트타임', '프리랜서', '협업']

export function JobPostForm({ userId, postId, initial, defaultKind = 'hiring' }: Props) {
  const router = useRouter()
  const editing = !!postId
  const kind: JobKind = (initial?.kind as JobKind) ?? defaultKind

  // 공통
  const [title, setTitle] = useState(initial?.title ?? '')
  const [position, setPosition] = useState(initial?.position ?? '')
  const [region, setRegion] = useState(initial?.region ?? '')
  const [workType, setWorkType] = useState(initial?.work_type ?? '')
  const [contact, setContact] = useState(initial?.contact ?? '')
  const [content, setContent] = useState(initial?.content ?? '')

  // 구인
  const [companyName, setCompanyName] = useState(initial?.company_name ?? '')
  const [salary, setSalary] = useState(initial?.salary ?? '')
  const [experienceRequired, setExperienceRequired] = useState(initial?.experience_required ?? '')
  const [deadline, setDeadline] = useState(initial?.deadline ?? '')
  const [alwaysOpen, setAlwaysOpen] = useState(editing && initial?.deadline === null && initial?.kind === 'hiring')

  // 구직
  const [experience, setExperience] = useState(initial?.experience ?? '')
  const [portfolioUrl, setPortfolioUrl] = useState(initial?.portfolio_url ?? '')
  const [availableFrom, setAvailableFrom] = useState(initial?.available_from ?? '')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const workTypeOptions = kind === 'hiring' ? HIRING_WORK_TYPES : SEEKING_WORK_TYPES

  const submit = async () => {
    setError(null)
    const t = title.trim()
    const p = position.trim()
    const r = region.trim()
    const w = workType.trim()
    const c = contact.trim()
    const body = content.trim()
    if (!t || !p || !r || !w || !c || !body) {
      setError('필수 항목(*)을 모두 입력해주세요')
      return
    }
    if (kind === 'hiring' && !companyName.trim()) {
      setError('공방/브랜드명을 입력해주세요')
      return
    }
    if (kind === 'hiring' && !alwaysOpen && !deadline) {
      setError('마감일을 입력하거나 상시모집을 선택해주세요')
      return
    }
    if (kind === 'seeking' && !experience.trim()) {
      setError('경력을 입력해주세요')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const payload = {
        kind,
        title: t,
        position: p,
        region: r,
        work_type: w,
        contact: c,
        content: body,
        company_name: kind === 'hiring' ? companyName.trim() || null : null,
        salary: kind === 'hiring' ? salary.trim() || null : null,
        experience_required: kind === 'hiring' ? experienceRequired.trim() || null : null,
        deadline: kind === 'hiring' ? (alwaysOpen ? null : deadline || null) : null,
        experience: kind === 'seeking' ? experience.trim() || null : null,
        portfolio_url: kind === 'seeking' ? portfolioUrl.trim() || null : null,
        available_from: kind === 'seeking' ? availableFrom || null : null,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      if (editing) {
        const { error: e } = await db
          .from('job_posts')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', postId)
        if (e) throw new Error(e.message)
        router.push(`/jobs/${postId}`)
        router.refresh()
      } else {
        const { data, error: e } = await db
          .from('job_posts')
          .insert({ ...payload, user_id: userId })
          .select('id')
          .single()
        if (e) throw new Error(e.message)
        router.push(`/jobs/${data.id}`)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패')
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <FormField label="제목" required>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={saving}
          maxLength={200}
          placeholder={kind === 'hiring' ? '예) 공방 스태프 모집' : '예) 프리랜서 도예가, 협업 가능합니다'}
          className={inputClass}
        />
      </FormField>

      {kind === 'hiring' && (
        <FormField label="공방/브랜드명" required>
          <input
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            disabled={saving}
            maxLength={100}
            placeholder="예) 무명도방"
            className={inputClass}
          />
        </FormField>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={kind === 'hiring' ? '직무' : '희망 직무'} required>
          <input
            type="text"
            value={position}
            onChange={e => setPosition(e.target.value)}
            disabled={saving}
            maxLength={100}
            placeholder={kind === 'hiring' ? '예) 도예 강사' : '예) 세라믹 디자이너'}
            className={inputClass}
          />
        </FormField>
        <FormField label={kind === 'hiring' ? '지역' : '희망 지역'} required>
          <input
            type="text"
            value={region}
            onChange={e => setRegion(e.target.value)}
            disabled={saving}
            maxLength={50}
            placeholder="예) 서울 성수동"
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label={kind === 'hiring' ? '근무 형태' : '근무 가능 형태'} required>
        <div className="flex flex-wrap gap-2">
          {workTypeOptions.map(w => (
            <button
              key={w}
              type="button"
              onClick={() => setWorkType(w)}
              disabled={saving}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                workType === w
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </FormField>

      {kind === 'hiring' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="급여">
              <input
                type="text"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                disabled={saving}
                maxLength={100}
                placeholder="예) 월 250만원 / 협의 가능"
                className={inputClass}
              />
            </FormField>
            <FormField label="경력 조건">
              <input
                type="text"
                value={experienceRequired}
                onChange={e => setExperienceRequired(e.target.value)}
                disabled={saving}
                maxLength={100}
                placeholder="예) 신입/경력 무관"
                className={inputClass}
              />
            </FormField>
          </div>
          <FormField label="마감일" required>
            <input
              type="date"
              value={alwaysOpen ? '' : (deadline ?? '')}
              onChange={e => setDeadline(e.target.value)}
              disabled={saving || alwaysOpen}
              className={`${inputClass} ${alwaysOpen ? 'opacity-40' : ''}`}
            />
            <button
              type="button"
              onClick={() => { setAlwaysOpen(o => !o); setDeadline('') }}
              disabled={saving}
              className={`mt-2 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                alwaysOpen
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              상시모집
            </button>
          </FormField>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="경력" required>
              <input
                type="text"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                disabled={saving}
                maxLength={100}
                placeholder="예) 3년차 / 신입"
                className={inputClass}
              />
            </FormField>
            <FormField label="가능 시작일">
              <input
                type="date"
                value={availableFrom ?? ''}
                onChange={e => setAvailableFrom(e.target.value)}
                disabled={saving}
                className={inputClass}
              />
            </FormField>
          </div>
          <FormField label="포트폴리오 링크">
            <input
              type="url"
              value={portfolioUrl}
              onChange={e => setPortfolioUrl(e.target.value)}
              disabled={saving}
              maxLength={500}
              placeholder="https://"
              className={inputClass}
            />
          </FormField>
        </>
      )}

      <FormField label="연락처" required>
        <input
          type="text"
          value={contact}
          onChange={e => setContact(e.target.value)}
          disabled={saving}
          maxLength={200}
          placeholder="예) 이메일, 인스타그램 DM, 카카오톡 오픈채팅 링크"
          className={inputClass}
        />
      </FormField>

      <FormField label={kind === 'hiring' ? '상세 내용' : '자기소개'} required>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={saving}
          maxLength={10000}
          rows={12}
          placeholder={
            kind === 'hiring'
              ? '주요 업무, 자격 요건, 우대 사항, 복지 등을 자유롭게 작성해주세요'
              : '경력, 작업 스타일, 강점, 관심 분야 등을 자유롭게 작성해주세요'
          }
          className={`${inputClass} resize-none leading-relaxed`}
        />
        <p className="text-xs text-stone-300 tabular-nums text-right mt-1">{content.length} / 10000</p>
      </FormField>

      {error && <p className="text-xs text-rose-500">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Link
          href={editing ? `/jobs/${postId}` : '/jobs'}
          className="text-xs tracking-wider text-stone-500 hover:text-stone-900 rounded-full px-4 py-2 transition-colors"
        >
          취소
        </Link>
        <button
          onClick={submit}
          disabled={saving}
          className="text-xs tracking-[0.18em] uppercase font-medium text-white bg-stone-900 rounded-full px-6 py-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {saving ? '저장중' : editing ? '수정' : '게시'}
        </button>
      </div>
    </div>
  )
}

const inputClass =
  'w-full text-sm bg-stone-50 rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-stone-300 placeholder:text-stone-400 disabled:opacity-60'

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-wider text-stone-500 mb-1.5">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
