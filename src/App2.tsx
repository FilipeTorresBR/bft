import './index.css'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
/*import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select" */
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'


const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  company: z.string(),
  email: z.string().email(),
  dateOfBirth: z.object({
    day: z.string(),
    month: z.string(),
    year: z.string()
  }),
})
type FormData = z.infer<typeof schema>

export function App() {
  const { handleSubmit, register, formState } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  function onSubmit(data: any){
    console.log(data)
  }
  return (
    <div className='flex items-center justify-center a h-screen w-full bg-zinc-100'>
      <div className='w-full max-w-5xl bg-white shadow rounded-lg p-4'>
        <form className='flex gap-6 flex-col mt-8' onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4">
      <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="eficiencia" className="block text-sm">
            Eficiência estimada (η<sub>b</sub>)
          </Label>
          <Input type="text" id="eficiencia" className="w-full mt-1" placeholder="0.7"/>
        </div>
        <div>
          <Label htmlFor="coeficiente-vazao" className="block text-sm">
            Coeficiente de vazão da bomba (q)
          </Label>
          <Input type="text" id="coeficiente-vazao" className="w-full mt-1" placeholder="0.00"/>
        </div>

        {/* Campo 3 */}
        <div>
          <Label
            htmlFor="coeficiente-altura"
            className="block text-sm"
          >
            Coeficiente de altura da bomba (h)
          </Label>
          <Input
            type="text"
            id="coeficiente-altura"
            className="w-full mt-1"
            placeholder="0.00"
          />
        </div>

        {/* Campo 4 */}
        <div>
          <Label
            htmlFor="fluxo-bomba-m3"
            className="block text-sm"
          >
            Fluxo da bomba - Qb (m³/s)
          </Label>
          <Input
            type="text"
            id="fluxo-bomba-m3"
            className="w-full mt-1"
            placeholder="0.00"
          />
        </div>

        {/* Campo 5 */}
        <div>
          <Label
            htmlFor="fluxo-bomba-m3h"
            className="block text-sm"
          >
            Fluxo da bomba - Qb (m³/h)
          </Label>
          <Input
            type="text"
            id="fluxo-bomba-m3h"
            className="w-full mt-1"
            placeholder="0.00"
          />
        </div>

        {/* Campo 6 */}
        <div>
          <Label
            htmlFor="altura-bomba"
            className="block text-sm"
          >
            Altura da bomba - Hb (m)
          </Label>
          <Input
            type="text"
            id="altura-bomba"
            className="w-full mt-1"
            placeholder="0.00"
          />
        </div>

        {/* Campo 7 */}
        <div>
          <Label
            htmlFor="rotacao-rpm"
            className="block text-sm"
          >
            Rotação da bomba - N (rpm)
          </Label>
          <Input
            type="text"
            id="rotacao-rpm"
            className="w-full mt-1"
            placeholder="0000"
          />
        </div>

        {/* Campo 8 */}
        <div>
          <Label
            htmlFor="diametro-bomba"
            className="block text-sm"
          >
            Diâmetro da bomba - D (m)
          </Label>
          <Input
            type="text"
            id="diametro-bomba"
            className="w-full mt-1"
            placeholder="0.123"
          />
        </div>
      </form>
    </div>
        </form>
      </div>
    </div>
    

  /*<div className='flex items-center justify-center a h-screen w-full bg-zinc-100'>
      <div className='w-full max-w-2xl bg-white shadow rounded-lg p-8'>
        <h1 className='text-2xl font-bold text-center'>Registration</h1>
        <form className='flex gap-6 flex-col mt-8' onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>First Name</Label>
                <Input type="text" {... register('firstName')}/>
                {formState.errors.firstName?.message && <span className='text-red-500 text-xs'>{formState.errors.firstName?.message}</span>}
              </div>
              <div>
                <Label>Last Name</Label>
                <Input type="text" {... register('lastName')}/>
              </div>
              {formState.errors.lastName?.message && <span className='text-red-500 text-xs'>{formState.errors.lastName?.message}</span>}
          </div>
          <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Email</Label>
                <Input type='email' {... register('email')}/>
                {formState.errors.email?.message && <span className='text-red-500 text-xs'> {formState.errors.email?.message}</span>}
              </div>
              <div>
                <Label>Company</Label>
                <Input type="text" {... register('company')}/>
                {formState.errors.company?.message && <span className='text-red-500 text-xs'> {formState.errors.company?.message}</span>}
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4 items-end'>
              <div>
                <Label>Date of Birth</Label>
                <Select {... register('dateOfBirth.day')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array(31).fill(1).map((_, index ) => {
                      const value = String(index +1).padStart(2, '0');
                      return(
                        <SelectItem key={String(index)} id={String(index)} value={value}>{value}</SelectItem>
                      )})}
                  </SelectContent>
                </Select>
                {formState.errors.dateOfBirth?.day?.message && <span className='text-red-500 text-xs'>{formState.errors.dateOfBirth?.message}</span>}
              </div>
              <div>
                <Select {... register('dateOfBirth.month')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array(12).fill(1).map((_, index) => { 
                      const value = String(index + 1).padStart(2, '0')
                      return (
                        <SelectItem key={String(index)} id={String(index)} value={value}>{value}</SelectItem> 
                    )})}
                  </SelectContent>
                </Select>
                {formState.errors.dateOfBirth?.month?.message && <span className='text-red-500 text-xs'>{formState.errors.dateOfBirth?.message}</span>}
              </div>
              <div>
                <Select {... register('dateOfBirth.year')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array(100).fill(1).map((_, index) => { 
                      const value = String(index + 1924)
                      return (
                        <SelectItem key={String(index)} id={String(index)} value={value}>{value}</SelectItem>
                    )})}
                  </SelectContent>
                </Select>
                {formState.errors.dateOfBirth?.year?.message && <span className='text-red-500 text-xs'>{formState.errors.dateOfBirth?.message}</span>}
              </div>
            </div>
            <Button type='submit'>Register</Button>
        </form>
      </div>
    </div>
    */
  )    
}
