// Copyright (C) 2022 Nethesis S.r.l.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ComponentPropsWithRef, forwardRef, useState, useRef, MutableRefObject } from 'react'
import classNames from 'classnames'
import { Avatar, Button, Dropdown, Modal } from '../common'
import {
  openEditContactDrawer,
  deleteContact,
  reloadPhonebook,
  fetchContact,
} from '../../lib/phonebook'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { closeSideDrawer } from '../../lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPhone,
  faEnvelope,
  faSuitcase,
  faUser,
  faTriangleExclamation,
  faFileLines,
  faEllipsisVertical,
  faPen,
  faTrash,
  faEye,
} from '@fortawesome/free-solid-svg-icons'

export interface ShowContactDrawerContentProps extends ComponentPropsWithRef<'div'> {
  config: any
}

export const ShowContactDrawerContent = forwardRef<
  HTMLButtonElement,
  ShowContactDrawerContentProps
>(({ config, className, ...props }, ref) => {
  const auth = useSelector((state: RootState) => state.authentication)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [contactToDelete, setContactToDelete] = useState<any>(null)
  const cancelDeleteButtonRef = useRef() as MutableRefObject<HTMLButtonElement>

  const showDeleteContactModal = (contact: any) => {
    setContactToDelete(contact)
    setShowDeleteModal(true)
  }

  const prepareDeleteContact = async () => {
    if (contactToDelete.id) {
      deleteContact(contactToDelete.id.toString())

      //// TODO show toast notification

      reloadPhonebook()
      setShowDeleteModal(false)
      setContactToDelete(null)
      closeSideDrawer()
    }
  }

  const contactMenuItems = (
    <>
      <Dropdown.Item icon={faPen} onClick={() => openEditContactDrawer(config)}>
        Edit
      </Dropdown.Item>
      <Dropdown.Item icon={faTrash} onClick={() => showDeleteContactModal(config)}>
        Delete
      </Dropdown.Item>
    </>
  )

  return (
    <>
      {/* delete contact modal */}
      <Modal
        show={showDeleteModal}
        focus={cancelDeleteButtonRef}
        onClose={() => setShowDeleteModal(false)}
        afterLeave={() => setContactToDelete(null)}
      >
        <Modal.Content>
          <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 bg-red-100 dark:bg-red-900'>
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className='h-6 w-6 text-red-600 dark:text-red-200'
              aria-hidden='true'
            />
          </div>
          <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
            <h3 className='text-lg font-medium leading-6 text-gray-900 dark:text-gray-100'>
              Delete contact
            </h3>
            <div className='mt-2'>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Contact <strong>{contactToDelete?.displayName || ''}</strong> will be permanently
                deleted.
              </p>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button variant='danger' onClick={() => prepareDeleteContact()}>
            Delete contact
          </Button>
          <Button
            variant='white'
            onClick={() => setShowDeleteModal(false)}
            ref={cancelDeleteButtonRef}
          >
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
      {/* drawer content */}
      <div className={classNames(className)} {...props}>
        <div className='flex min-w-0 flex-1 items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex-shrink-0 mr-4'>
              {config.kind == 'person' ? (
                <Avatar placeholderType='person' />
              ) : (
                <Avatar placeholderType='company' />
              )}
            </div>
            <h2 className='text-xl font-medium text-gray-900 dark:text-gray-100'>
              {config.displayName}
            </h2>
          </div>
          {config.owner_id === auth.username && (
            <div>
              <Dropdown
                items={contactMenuItems}
                position='left'
                divider={true}
                className='mr-1 mt-1'
              >
                <Button variant='white'>
                  <FontAwesomeIcon icon={faEllipsisVertical} className='h-4 w-4' />
                  <span className='sr-only'>Open contact menu</span>
                </Button>
              </Dropdown>
            </div>
          )}
        </div>
        <div className='mt-5 border-t border-gray-200 dark:border-gray-700'>
          <dl className='sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700'>
            {/* company */}
            {config.kind == 'person' && config.company && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5'>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Company</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0'>
                  <div className='flex items-center text-sm'>
                    <FontAwesomeIcon
                      icon={faSuitcase}
                      className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500'
                      aria-hidden='true'
                    />
                    <span>{config.company}</span>
                  </div>
                </dd>
              </div>
            )}
            {/* extension */}
            {config.extension && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5'>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Extension</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0'>
                  <div className='flex items-center text-sm text-primary dark:text-primary'>
                    <FontAwesomeIcon
                      icon={faPhone}
                      className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500'
                      aria-hidden='true'
                    />
                    <span className='truncate cursor-pointer'>{config.extension}</span>
                  </div>
                </dd>
              </div>
            )}
            {/* work phone */}
            {config.workphone && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5'>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Work phone</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0'>
                  <div className='flex items-center text-sm text-primary dark:text-primary'>
                    <FontAwesomeIcon
                      icon={faPhone}
                      className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500'
                      aria-hidden='true'
                    />
                    <span className='truncate cursor-pointer'>{config.workphone}</span>
                  </div>
                </dd>
              </div>
            )}
            {/* mobile phone */}
            {config.cellphone && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5'>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Mobile phone
                </dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0'>
                  <div className='flex items-center text-sm text-primary dark:text-primary'>
                    <FontAwesomeIcon
                      icon={faPhone}
                      className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500'
                      aria-hidden='true'
                    />
                    <span className='truncate cursor-pointer'>{config.cellphone}</span>
                  </div>
                </dd>
              </div>
            )}
            {/* work email */}
            {config.workemail && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5'>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Email</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0'>
                  <div className='flex items-center text-sm text-primary dark:text-primary'>
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500'
                      aria-hidden='true'
                    />
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={`mailto: ${config.workemail}`}
                      className='truncate'
                    >
                      {config.workemail}
                    </a>
                  </div>
                </dd>
              </div>
            )}
            {/* notes */}
            {config.notes && (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5'>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Notes</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0'>
                  <div className='flex items-center text-sm'>
                    <FontAwesomeIcon
                      icon={faFileLines}
                      className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500'
                      aria-hidden='true'
                    />
                    <div>{config.notes}</div>
                  </div>
                </dd>
              </div>
            )}
            {/* company contacts */}
            {config.contacts && config.contacts.length ? (
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5'>
                <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Company contacts
                </dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0'>
                  <ul role='list'>
                    {config.contacts.map((contact: any, index: number) => (
                      <li
                        key={index}
                        className='flex items-center justify-between pb-3 pr-4 text-sm'
                      >
                        <div className='flex w-0 flex-1 items-center'>
                          <FontAwesomeIcon
                            icon={faUser}
                            className='h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500'
                            aria-hidden='true'
                          />
                          <span
                            className='ml-2 w-0 flex-1 truncate text-primary dark:text-primary cursor-pointer'
                            onClick={() => fetchContact(contact.id, contact.source)}
                          >
                            {contact.name}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
            {/* visibility */}
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5'>
              <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Visibility</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0'>
                <div className='flex items-center text-sm'>
                  <FontAwesomeIcon
                    icon={faEye}
                    className='mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500'
                    aria-hidden='true'
                  />
                  <span className='truncate'>
                    {config.type === 'private' && config.source === 'cti' ? 'Only me' : 'Public'}
                  </span>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
})

ShowContactDrawerContent.displayName = 'ShowContactDrawerContent'
