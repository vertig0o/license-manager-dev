import {
  cCenter,
  cLeading,
  Color,
  cTop,
  ForEach,
  HStack,
  ScrollView,
  Text,
  UIImage,
  UIRouteLink,
  VStack,
  ReactViewClass,
  ReactView,
  useNavigate,
  Spacer,
  Spinner,
} from '@tuval/forms'
import { themeColor } from '../assets/Colors/themeColor'
import logo from '../assets/Logo/logo'
import React, { Fragment, useEffect } from 'react'
import {
  BiAnalyse,
  BiListUl,
  BiLogOutCircle,
  BiNetworkChart,
} from 'react-icons/bi'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { CgUserList } from 'react-icons/cg'
import { AiOutlineDatabase } from 'react-icons/ai'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { TbBrandMiniprogram } from 'react-icons/tb'
import { GrUserSettings } from 'react-icons/gr'
import { SlSettings } from 'react-icons/sl'
import { VscTypeHierarchySuper } from 'react-icons/vsc'

import {
  MdDashboard,
  MdIncompleteCircle,
  MdOutlineAssignment,
} from 'react-icons/md'
import styled from 'styled-components'
import { FiMenu, FiX } from 'react-icons/fi'
import { RiParentLine } from 'react-icons/ri'
import AccountRelation from '../../server/hooks/accountRelation/Main'
import { useGetMe, useListAccounts } from '@realmocean/sdk'

export interface menuModel {
  title: string
  icon?: ReactViewClass
  link?: string
  subMenu?: any[]
  isVisible: boolean
}

const PortalMenuMain = styled.div`
  @media screen and (max-width: 1000px) {
    display: none;
  }
`

const PortalMenuTablet = styled.div`
  display: none;
  @media screen and (max-width: 1000px) {
    display: block;
    position: absolute;
    z-index: 999;
    top: 0; // Hamburger menünün üst kısmına yerleşmesi için
    left: 0; // Hamburger menünün sol kısmına yerleşmesi için
  }
`

const HamburgerMenuButton = styled.div`
  width: 40px;
  height: 40px;
  background: #ffffff9e;
  border-radius: 100%;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
`

const HamburgerMenu = styled.div`
  width: 300px;
  background: #0000009e;
  height: calc(100vh - 60px);
  top: 60px;
  left: 0;
  padding: 20px;
`

export const PortalMenu = (selectedMenuTitle: string) => {
  const navigate = useNavigate()

  const [isTabletMenuOpen, setTabletMenuOpen] = React.useState(false)
  const { accounts } = useListAccounts()
  const { listAccountRelation } = AccountRelation.List()
  const { me } = useGetMe('console')
  const [isAdmin, setIsAdmin] = React.useState(null)

  useEffect(() => {
    localStorage.getItem('role') == 'admin'
      ? setIsAdmin(true)
      : setIsAdmin(false)
  }, [])

  const toggleTabletMenu = () => {
    setTabletMenuOpen(!isTabletMenuOpen)
  }
  function deleteAllCookies() {
    const cookies = document.cookie.split(';')

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i]
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }

  const menuItems: menuModel[] = [
    {
      title: 'Dashboard',
      link: '/app/dashboard',
      icon: ReactView(<MdDashboard size={25} color={'white'} />),
      isVisible: true,
    },
    {
      title: 'Müşteriler',
      link: `/app/customer/list`,
      icon: ReactView(<HiOutlineDocumentReport size={25} color={'white'} />),
      isVisible: true,
    },

    {
      title: 'Lisanslar',
      link: `/app/license/list`,
      icon: ReactView(<HiOutlineDocumentReport size={25} color={'white'} />),
      isVisible: true,
    },
    // {
    //   title: 'Lisans Uzatmalar',
    //   link: `/app/license-extension/list`,
    //   icon: ReactView(<HiOutlineDocumentReport size={25} color={'white'} />),
    //   isVisible: true,
    // },
    {
      title: 'Analizler',
      link: `/app/analyzes/view`,
      icon: ReactView(<BiAnalyse size={25} color={'white'} />),
      isVisible: true,
    },
    {
      title: 'Altyapı Tanımları',
      subMenu: [
        {
          title: 'Hesap Yönetimi',
          link: `/app/account-management/list`,
          icon: ReactView(<GrUserSettings size={25} color={'white'} />),
          isVisible: true,
        },
        {
          title: 'Parametreler',
          link: `/app/parameters/view`,
          icon: ReactView(<SlSettings size={25} color={'white'} />),
          isVisible: localStorage.getItem('role') == 'admin' ? true : false,
        },
      ],
      isVisible: true,
    },
  ]

  const logout2 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA2klEQVR4nO2XwQ3CMAxF36kbEODWOWA5TrTMg1gEkFigZQ0jJCNQRVIaOemBfMmXyrGf4thyoeitCjgAd0CMrQdazeFVmyDx0JoQQK9OG+y1/bgJr0QtlUbjSwHApgQ1cATc4PsuVwlOGufigUgOsADOGusGrH89KIaPMApCjLtgMoQkaMNJEDICYDGKgxCSCWAVC2BRAm/yFABuzkfodBDN0oYuJnmKUXwFlnOM4lohviUv+4DkKEF0/F4dngtkqqW0Czk1GdbyfQigUojXTVhap8mDPyZF/6kHYirhVdS+yFAAAAAASUVORK5CYII='

  const logout = () => {
    navigate('/logout')
  }
  return ReactView(
    // !isAdmin ? (
    //   <Fragment>{VStack(Spinner()).maxWidth('288px').render()}</Fragment>
    // ) : (
    <div
      style={{ position: 'relative', height: '100%', transition: 'all .3s' }}
    >
      <PortalMenuMain>
        <Fragment>
          {
            VStack(
              VStack({ alignment: cTop })(
                VStack({})(
                  HStack({})(
                    UIImage(logo)
                      .width('40px')
                      .onClick(() => navigate('/app/dashboard'))
                      .cursor('pointer'),
                    Text('License Manager')
                      .foregroundColor('white')
                      .fontSize('18px')
                      .fontWeight('700')
                      .kerning('1px')
                      .onClick(() => navigate('/app/dashboard'))
                      .cursor('pointer')
                  ),
                  HStack({})(
                    Text(me?.name)
                      .foregroundColor('white')
                      .fontSize('14px')
                      .fontWeight('500')
                      .kerning('1px')
                  )
                )
                  .height(80)
                  .borderBottom('1px solid #fff3'),
                ScrollView({ axes: 'cVertical' })(
                  VStack({ alignment: cTop })(
                    ...ForEach(menuItems)((menuItem, index) =>
                      menuItem.subMenu == null
                        ? menuItem.isVisible &&
                          UIRouteLink(menuItem.link)(
                            HStack({ alignment: cLeading })(
                              menuItem.icon,
                              Text(menuItem.title)
                                .foregroundColor('white')
                                .paddingLeft('.5rem')
                            )
                              .height('50px')
                              .width('256px')
                              .cornerRadius('.5rem')
                              .paddingLeft('1rem')
                              .background({
                                default:
                                  menuItem.title == selectedMenuTitle
                                    ? 'linear-gradient(to top right, #1e88e5, #42a5f5)'
                                    : '',
                                hover:
                                  menuItem.title == selectedMenuTitle
                                    ? ''
                                    : 'rgba(255, 255,255, .2)',
                              })
                              .foregroundColor('white')
                              .shadow(
                                menuItem.title == selectedMenuTitle
                                  ? '0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(33 150 243 / .2), 0 2px 4px -2px rgb(33 150 243 / .2)'
                                  : ''
                              )
                          ).paddingTop('0.5rem')
                        : menuItem.isVisible &&
                          VStack({ alignment: cTop })(
                            HStack({ alignment: cLeading })(
                              Text(menuItem.title)
                                .textTransform('uppercase')
                                .fontWeight('900')
                                .fontSize('13px')
                                .foregroundColor('white')
                            )
                              .height()
                              .paddingLeft('20px'),
                            VStack(
                              ...ForEach(menuItem.subMenu)(
                                (subItem) =>
                                  subItem.isVisible &&
                                  UIRouteLink(subItem.link)(
                                    HStack({ alignment: cLeading })(
                                      subItem.icon,
                                      Text(subItem.title)
                                        .foregroundColor('white')
                                        .paddingLeft('.5rem')
                                    )
                                      .height('50px')
                                      .width('256px')
                                      .cornerRadius('.5rem')
                                      .paddingLeft('1rem')
                                      .background({
                                        default:
                                          subItem.title == selectedMenuTitle
                                            ? 'linear-gradient(to top right, #1e88e5, #42a5f5)'
                                            : '',
                                        hover:
                                          subItem.title == selectedMenuTitle
                                            ? ''
                                            : 'rgba(255, 255,255, .2)',
                                      })
                                      .transition('.2s')
                                      .foregroundColor('white')
                                      .shadow(
                                        subItem.title == selectedMenuTitle
                                          ? '0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(33 150 243 / .2), 0 2px 4px -2px rgb(33 150 243 / .2)'
                                          : ''
                                      )
                                  ).paddingTop('0.5rem')
                              )
                            )
                          )
                            .paddingTop('2rem')
                            .height()
                    )
                  )
                    .paddingTop('10px')
                    .width('100%'),
                  Spacer(),
                  HStack({ alignment: cLeading })(
                    ReactView(
                      <BiLogOutCircle
                        size={25}
                        color={'white'}
                        cursor={'pointer'}
                        onClick={() => {
                          logout()
                        }}
                      />
                    )
                  )
                    .margin('230px 0 30px 20px')
                    .height()
                )
              )
                .cornerRadius('0.75rem')
                .background(themeColor)
            )
              .width(288)
              .minWidth('288px')
              .maxWidth('288px')
              .background(Color.white)
              .render() //.padding(10)
          }
        </Fragment>
      </PortalMenuMain>
      <PortalMenuTablet>
        <div>
          {!isTabletMenuOpen && (
            <HamburgerMenuButton onClick={toggleTabletMenu}>
              <FiMenu size={30} />
            </HamburgerMenuButton>
          )}

          {isTabletMenuOpen && (
            <HamburgerMenu>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <HamburgerMenuButton onClick={toggleTabletMenu}>
                  <FiX size={30} />
                </HamburgerMenuButton>
              </div>

              <Fragment>
                {ScrollView({ axes: 'cVertical' })(
                  VStack({ alignment: cTop })(
                    ...ForEach(menuItems)((menuItem, index) =>
                      menuItem.subMenu == null
                        ? menuItem.isVisible &&
                          UIRouteLink(menuItem.link)(
                            HStack({ alignment: cLeading })(
                              menuItem.icon,
                              Text(menuItem.title)
                                .foregroundColor('white')
                                .paddingLeft('.5rem')
                            )
                              .height('50px')
                              .width('256px')
                              .cornerRadius('.5rem')
                              .paddingLeft('1rem')
                              .background({
                                default:
                                  menuItem.title == selectedMenuTitle
                                    ? 'linear-gradient(to top right, #1e88e5, #42a5f5)'
                                    : '',
                                hover:
                                  menuItem.title == selectedMenuTitle
                                    ? ''
                                    : 'rgba(255, 255,255, .2)',
                              })
                              .foregroundColor('white')
                              .shadow(
                                menuItem.title == selectedMenuTitle
                                  ? '0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(33 150 243 / .2), 0 2px 4px -2px rgb(33 150 243 / .2)'
                                  : ''
                              )
                          ).paddingTop('0.5rem')
                        : menuItem.isVisible &&
                          VStack({ alignment: cTop })(
                            HStack({ alignment: cLeading })(
                              Text(menuItem.title)
                                .textTransform('uppercase')
                                .fontWeight('900')
                                .fontSize('13px')
                                .foregroundColor('white')
                            )
                              .height()
                              .paddingLeft('20px'),
                            VStack(
                              ...ForEach(menuItem.subMenu)(
                                (subItem) =>
                                  subItem.isVisible &&
                                  UIRouteLink(subItem.link)(
                                    HStack({ alignment: cLeading })(
                                      subItem.icon,
                                      Text(subItem.title)
                                        .foregroundColor('white')
                                        .paddingLeft('.5rem')
                                    )
                                      .height('50px')
                                      .width('256px')
                                      .cornerRadius('.5rem')
                                      .paddingLeft('1rem')
                                      .background({
                                        default:
                                          subItem.title == selectedMenuTitle
                                            ? 'linear-gradient(to top right, #1e88e5, #42a5f5)'
                                            : '',
                                        hover:
                                          subItem.title == selectedMenuTitle
                                            ? ''
                                            : 'rgba(255, 255,255, .2)',
                                      })
                                      .transition('.2s')
                                      .foregroundColor('white')
                                      .shadow(
                                        subItem.title == selectedMenuTitle
                                          ? '0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(33 150 243 / .2), 0 2px 4px -2px rgb(33 150 243 / .2)'
                                          : ''
                                      )
                                  ).paddingTop('0.5rem')
                              )
                            )
                          )
                            .paddingTop('2rem')
                            .height()
                    )
                  )
                    .width('100%')
                    .onClick(() => setTabletMenuOpen(false)),
                  Spacer(),
                  VStack({ alignment: cLeading })(
                    ReactView(
                      <BiLogOutCircle
                        size={25}
                        color={'white'}
                        cursor={'pointer'}
                        onClick={() => {
                          localStorage.clear()
                          const host = window.location.href
                          const link = host.split('/app')[0]
                          window.location.href = link + '/logout'
                        }}
                      />
                    )
                  )
                    .margin('0 0 30px 10px')
                    .height()
                ).render()}
              </Fragment>
            </HamburgerMenu>
          )}
        </div>
      </PortalMenuTablet>
    </div>
  )
}
