<?php


use Illuminate\Database\Seeder;
use Faker\Factory as FakerFactory;

class UserTableSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'password' => bcrypt('admin-seydu1!'),
                'email' => 'sgueye@mmseducation.com',
                'name' => 'sgueye',
                'first_name' => 'Saidou',
                'last_name' => 'Gueye',
            ],
            [
                'password' => bcrypt('admin-david3!'),
                'email' => 'danastasi@mmseducation.com',
                'name' => 'danastasi',
                'first_name' => 'David',
                'last_name' => 'Anastasi',

            ],
            [
                'password' => bcrypt('admin-ray2!'),
                'email' => 'rosuji@mmseducation.com',
                'name' => 'rosuji',
                'first_name' => 'Ray',
                'last_name' => 'Osuji',
            ]
        ];
        foreach ($data as $code => $item) {
            $userID = DB::table('users')->insertGetId($item);
        }
    }
}
