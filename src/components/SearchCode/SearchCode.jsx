import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../../app/dataSlice'
import MarginSection from '../MarginMenu/MarginMenu'
import MainInput from '../MainInput/MainInput'
import Button from '../Button/Button'
import './style.scss'

export default function SearchCode() {
  const { status } = useSelector((state) => state.codeStore)
  const dispatch = useDispatch()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleSetCode = (event) => {
    const regex = /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/

    if (regex.test(code)) {
      setCode(event.target.value)
      setError('')
    } else {
      setCode(event.target.value)
      setError('Можно вводить только числа, символы и латинские буквы')
    }
  }

  async function submit(e) {
    e.preventDefault()

    if (code.length < 3) {
      toast.error('Необходимо ввести минимум 3 символа')
      setError('Можно вводить только числа, символы и латинские буквы')
      return
    }

    dispatch(fetchData(code))
    setCode('')
  }

  return (
    <form
      className="main"
      onSubmit={(event) => submit(event)}
      style={{ position: 'relative', minWidth: '210px', flexBasis: '30%' }}>
      <h2 className="title">
        <FontAwesomeIcon
          icon={faScrewdriverWrench}
          rotation={90}
          size="2xl"
          style={{ marginRight: '20px' }}
        />
        Подбор
        <br /> автозапчастей
      </h2>
      <MainInput
        value={code}
        onChange={handleSetCode}
        status={status}
        title={'Введите артикул'}
        error={error}
      />
      <div className="button-group">
        <Button
          disabled={status === 'pending' ? true : false}
          children={status === 'pending' ? 'Загрузка...' : 'Отправить запрос'}
        />
      </div>
      <MarginSection />
    </form>
  )
}
